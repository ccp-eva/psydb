'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var SUBJECT_CREATE = (options) => {
    var {
        recordType,
        as: cacheAs,
        data,
    } = options;

    var tag = `subject/${recordType}/create`;
    if (cacheAs) {
        tag = `${tag} as "${cacheAs}"`
    }

    return step(tag, async function () {
        var { ids, send, deltas } = this.bag;

        var payload = { props: {} };
        if (typeof data === 'function') {
            data = data(this);
        }
        for (var it of data) {
            var { subChannel, data: subChannelData } = it;
            payload.props[subChannel] = subChannelData;
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: `subject/${recordType}/create`,
            timezone: 'Europe/Berlin',
            payload
        }));
        
        await deltas.update();
        var [ index ] = deltas.findEntry('subject', channelId);

        //console.ejson(deltas.subject.getCurrent());
        deltas.subject.test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'type': recordType,
            'sequenceNumber': String(index + 1),
            'isDummy': false,
            'onlineId': BaselineDeltas.AnyString(),
            'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state': {
                    ...payload.props.scientific,
                    'internals': {
                        'isRemoved': false,
                        'invitedForExperiments': [],
                        'participatedInStudies': [],
                        'mergedDuplicates': [],
                        'nonDuplicateIds': []
                    }
                }
            },
            'gdpr': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state': { ...payload.props.gdpr }
            }
        }}, asFlatEJSON: true });

        if (cacheAs) {
            jsonpointer.set(
                this, `/cachedIds/subject/${cacheAs}`, channelId
            );
        }
    })
}

module.exports = SUBJECT_CREATE;
