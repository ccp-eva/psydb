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
        return step(tag, async function () {
            var { send, deltas, currentCrtId } = this.bag;

            if (withCachedCRT) {
                currentCrtId = this.cache.crt[withCachedCRT]._id
            }

            var payload = createPayload({
                currentCrtId, subChannelKey, systemType, fieldKey,
                props: definitionOptions
            });

            for (var [ptr, value] of Object.entries(overrides)) {
                jsonpointer.set(payload, ptr, value)
            }
            
            await send({
                type: 'custom-record-types/add-field-definition',
                timezone: 'Europe/Berlin', payload
            });

            await deltas.update();
            
            var index = deltas.getCurrent_RAW().findIndex((it) => {
                //console.log(String(it._id), String(currentCrtId));
                return String(it._id) === String(currentCrtId)
            });
            //console.log({ currentCrtId, index });
           
            var expected = createExpectedCRTDelta({
                payload, currentCrt: deltas.getCurrent_RAW()[index]
            });

            deltas.test({ expected: {
                [index]: expected
            }, asFlatEJSON: true });
        });
    }

    return STEP_WRAPPER;
}

module.exports = build_addFieldDefinitionStep;
