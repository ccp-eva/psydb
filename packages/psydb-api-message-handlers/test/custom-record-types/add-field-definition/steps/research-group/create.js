'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var RESEARCH_GROUP_CREATE = (options) => {
    var { data, as: cacheAs } = options;

    var tag = `researchGroup/create`;
    if (cacheAs) {
        tag = `${tag} as "${cacheAs}"`
    }

    return step(tag, async function () {
        var { ids, send, deltas } = this.bag;
        if (!data) {
            data = {
                'name': `The ${cacheAs} Lab`,
                'shorthand': `RG ${cacheAs}`,
                'address': {
                    'country': 'DE', 'city': '', 'postcode': '',
                    'street': '', 'housenumber': '', 'affix': ''
                },
                'description': '',
            }
        }

        var payload = { props: data };

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'researchGroup/create',
            timezone: 'Europe/Berlin',
            payload
        }));
        
        await deltas.update();
        var [ index ] = deltas.findEntry('researchGroup', channelId);
        
        deltas.researchGroup.test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'sequenceNumber': String(index + 1),
            'isDummy': false,
            'state': {
                ...payload.props,
                'helperSetIds': [],
                'labMethods': [],
                'locationTypes': [],
                'studyTypes': [],
                'subjectTypes': [],
                'systemRoleIds': []
            }
        }}, asFlatEJSON: true });

        if (cacheAs) {
            jsonpointer.set(
                this, `/cachedIds/researchGroup/${cacheAs}`, channelId
            );
        }
    })
}

module.exports = RESEARCH_GROUP_CREATE;
