'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var ADD_SANE_STRING_FIELD = (options = {}) => {
    var { key, subChannelKey = undefined, overrides = {} } = options;

    var tag = 'custom-record-type/add-field-definition SaneString';
    return step(tag, async function () {
        var { send, deltas, currentCrtId } = this.bag;
        var bag = { currentCrtId, subChannelKey, type, key };

        var payload = createPayload({ ...bag, props: {
            minLength: 0
        }});

        for (var [ptr, value] of Object.keys(overrides)) {
            jsonpointer.set(payload, ptr, value)
        }
        
        await send({
            type: 'custom-record-type/add-field-definition',
            timezone: 'Europe/Berlin', payload
        });

        await deltas.update();
       
        var expected = createExpectedCRTDelta({
            payload
        });

        deltas.test({ expected: {
            '0': expected
        }, asFlatEJSON: true });
    })
};
