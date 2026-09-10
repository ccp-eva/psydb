'use strict';
var { jsonpointer, ucfirst } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CREATE_HELPER_SET_ITEM = (options = {}) => {
    var { itemKey, withCachedHelperSet = false } = options;

    var tag = `helperSetItem/create ${itemKey}`;
    if (withCachedHelperSet) {
        tag = `HELPER_SET(${withCachedHelperSet}) : ${tag}`;
    }

    return step(tag, async function () {
        var { ids, send, deltas, currentHelperSetId } = this.bag;

        if (withCachedHelperSet) {
            currentHelperSetId = this.cachedIds.helperSet[withCachedHelperSet]
        }

        var displayName_EN = `${ucfirst(itemKey)} EN`;
        var displayName_DE = `${ucfirst(itemKey)} DE`;

        var payload = {
            'setId': currentHelperSetId,
            'props': {
                'label': displayName_EN,
                'displayNameI18N': { 'de': displayName_DE }
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'helperSetItem/create',
            timezone: 'Europe/Berlin',
            payload
        }));
        
        await deltas.update();
        var [ index ] = deltas.findEntry('helperSetItem', channelId);
       
        deltas.helperSetItem.test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'setId': currentHelperSetId,
            'state': {
                'label': displayName_EN,
                'displayNameI18N': { de: displayName_DE },
            }
        }}, asFlatEJSON: true });
        
        jsonpointer.set(
            this, `/cachedIds/helperSetItem/${itemKey}`, channelId
        );
    })
}

module.exports = CREATE_HELPER_SET_ITEM;
