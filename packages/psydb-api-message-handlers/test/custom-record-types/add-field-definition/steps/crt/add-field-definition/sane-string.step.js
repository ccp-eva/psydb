'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { createPayload, createExpectedCRTDelta } = require('./helpers');

var ADD_SANE_STRING_FIELD = (options = {}) => {
    var {
        withCachedCRT = false,
        key, subChannelKey = undefined, overrides = {}
    } = options;

    var systemType = 'SaneString';
    var tag = `custom-record-type/add-field-definition ${systemType}`;
    return step(tag, async function () {
        var { send, deltas, currentCrtId } = this.bag;

        if (withCachedCRT) {
            currentCrtId = this.cache.crt[withCachedCRT]._id
        }

        var bag = { currentCrtId, subChannelKey, systemType, key };

        var payload = createPayload({ ...bag, props: {
            minLength: 0
        }});

        for (var [ptr, value] of Object.keys(overrides)) {
            jsonpointer.set(payload, ptr, value)
        }
        
        await send({
            type: 'custom-record-types/add-field-definition',
            timezone: 'Europe/Berlin', payload
        });

        await deltas.update();
        
        var index = deltas.getCurrent().findIndex((it) => {
            console.log(it._id['$oid'], String(currentCrtId));
            return it._id['$oid'] === String(currentCrtId)
        });
        console.log({ currentCrtId, index });
       
        var expected = createExpectedCRTDelta({
            payload
        });

        deltas.test({ expected: {
            [index]: expected
        }, asFlatEJSON: true });
    })
};

module.exports = ADD_SANE_STRING_FIELD;
