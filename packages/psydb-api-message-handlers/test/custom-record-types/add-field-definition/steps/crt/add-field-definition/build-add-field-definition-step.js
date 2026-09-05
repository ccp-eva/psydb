'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { createPayload, createExpectedCRTDelta } = require('./helpers');

var build_addFieldDefinitionStep = (buildOptions) => {
    var {
        systemType,
        definitionOptions = {},
        extraExpectedDefinitionOptions = {},
    } = buildOptions;

    var STEP_WRAPPER = (wrapperOptions) => {
        var {
            withCachedCRT = false,
            fieldKey, subChannelKey = undefined, overrides = {}
        } = wrapperOptions;

        var tag = `custom-record-type/add-field-definition ${systemType}`;
        if (withCachedCRT) {
            tag = `CRT(${withCachedCRT}) : ${tag}`;
        }
        return step(tag, async function () {
            var { send, deltas, currentCrtId } = this.bag;

            if (withCachedCRT) {
                currentCrtId = this.cachedIds.crt[withCachedCRT]
            }

            var payload = createPayload({
                currentCrtId, subChannelKey, systemType, fieldKey,
                props: definitionOptions
            });

            if (typeof overrides === 'function') {
                overrides = overrides(this);
            }
            for (var [ptr, value] of Object.entries(overrides)) {
                jsonpointer.set(payload, ptr, value)
            }
            
            await send({
                type: 'custom-record-types/add-field-definition',
                timezone: 'Europe/Berlin', payload
            });

            await deltas.update();
            var [ index, record ] = deltas.findEntry('crt', currentCrtId);
            
            var expected = createExpectedCRTDelta({
                payload, currentCrt: record
            });

            deltas.crt.test({ expected: {
                [index]: expected
            }, asFlatEJSON: true });
        });
    }

    return STEP_WRAPPER;
}

module.exports = build_addFieldDefinitionStep;
