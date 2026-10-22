'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

// NOTE: experiments are included since clean-gdpr may fixate testing ages
// there; the fixture has none, so they must stay untouched
var COLLECTIONS = [ 'subject', 'rohrpostEvents', 'experiment' ];

describe('subject/clean-gdpr', function () {
    var ids, send, deltas;

    before(async function () {
        ids = await this.restore([ 'init-cats-with-data-small' ], {
            gatherIds: true
        });

        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

        deltas = BaselineDeltas.Multi(COLLECTIONS);
        deltas.update = async () => {
            deltas.push(await this.aggregateAll(COLLECTIONS));
        }

        await deltas.update();
    });

    step('clean-gdpr of cat owner', async function () {
        await send({
            type: 'subject/clean-gdpr',
            timezone: 'Europe/Berlin',
            payload: { _id: ids(/^Ironclad, Blackbird /) },
        });

        await deltas.update();

        deltas.subject.test({ expected: {
            '5': {
                'gdpr': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    '_rohrpostMetadata/EXECUTED_MAKE_CLEAN': true,
                    'state': '[[REDACTED]]',
                },
                // NOTE: from fixating testing ages of participations;
                // dispatched even though there are none
                'scientific': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                },
            },
        }, asFlatEJSON: true });

        deltas.rohrpostEvents.test({ expected: {
            // NOTE: the original gdpr create event of the owner
            '167': {
                'message/payload': '[[REDACTED]]',
            },
            // NOTE: new events are appended after the existing 189
            '189': {
                '_id': BaselineDeltas.AnyObjectId(),
                'correlationId': BaselineDeltas.AnyObjectId(),
                'sessionId': BaselineDeltas.AnyObjectId(),
                'timestamp': BaselineDeltas.AnyDate(),
                'collectionName': 'subject',
                'channelId': ids(/^Ironclad, Blackbird /),
                'subChannelKey': 'scientific',
                'message/personnelId': ids(/ROOT/),
                'message/payload/~1$set': {},
            },
            '190': {
                '_id': BaselineDeltas.AnyObjectId(),
                'correlationId': BaselineDeltas.AnyObjectId(),
                'sessionId': BaselineDeltas.AnyObjectId(),
                'timestamp': BaselineDeltas.AnyDate(),
                'collectionName': 'subject',
                'channelId': ids(/^Ironclad, Blackbird /),
                'subChannelKey': 'gdpr',
                'message/personnelId': ids(/ROOT/),
                'message/type': 'MAKE_CLEAN',
                'message/payload/~1$set': {
                    '~1gdpr~1_rohrpostMetadata~1EXECUTED_MAKE_CLEAN': true,
                    '~1gdpr~1state': '[[REDACTED]]',
                }
            },
        }, asFlatEJSON: true });

        deltas.experiment.test({ expected: {}});
    });
});
