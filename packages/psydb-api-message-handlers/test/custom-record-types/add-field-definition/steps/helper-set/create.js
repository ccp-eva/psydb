'use strict';
var { jsonpointer, ucfirst } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CREATE_HELPER_SET = (key, options = {}) => {

    var tag = `helperSet/create ${key}`;

    return step(tag, async function () {
        var { ids, send, deltas } = this.bag;
        var now = new Date();

        var displayName_EN = `${ucfirst(key)} EN`;
        var displayName_DE = `${ucfirst(key)} DE`;

        var payload = {
            'props': {
                'label': displayName_EN,
                'displayNameI18N': { 'de': displayName_DE }
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'helperSet/create',
            timezone: 'Europe/Berlin',
            payload
        }));

        await deltas.update();
        var [ index ] = deltas.findEntry('helperSet', channelId);

        deltas.helperSet.test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'sequenceNumber': String(index + 1),
            'isDummy': false,
            'state': {
                'label': displayName_EN,
                'displayNameI18N': { de: displayName_DE },
            }
        }}, asFlatEJSON: true });
       
        this.bag.currentHelperSetId = channelId;
        jsonpointer.set(this, `/cachedIds/helperSet/${key}`, channelId)
    })
}

module.exports = CREATE_HELPER_SET;
