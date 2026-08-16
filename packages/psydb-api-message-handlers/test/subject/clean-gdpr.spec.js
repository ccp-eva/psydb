'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('subject/clean-gdpr', function () {
    var db, ids, sendMessage;
    before(async function () {
        ids = await this.restore('2026-03-24__0113', { gatherIds: true });
        db = this.getDbHandle();

        var login = await this.createFakeLogin({ email: 'root@example.com' });
        ([ sendMessage ] = this.createMessenger({ ...login }));
    });

    it('does clean-gdpr', async function () {
        var _id = ids(/Charlie2/);

        var deltas = BaselineDeltas();
        deltas.push({
            'subject': await this.fetchAllRecords('subject', { _id }),
            'events': await this.fetchAllRecords(
                'rohrpostEvents', { channelId: _id }
            ),
        });

        var payload = { _id };

        await sendMessage({
            type: 'subject/clean-gdpr', timezone: 'Europe/Berlin',
            payload
        });
       
        deltas.push({
            'subject': await this.fetchAllRecords('subject', { _id }),
            'events': await this.fetchAllRecords(
                'rohrpostEvents', { channelId: _id }
            ),
        });
        deltas.test({ expected: {
            '/subject/0/gdpr/_rohrpostMetadata':
                BaselineDeltas.AnyRohrpostMeta(),
            '/subject/0/gdpr/_rohrpostMetadata/EXECUTED_MAKE_CLEAN': true,
            '/subject/0/gdpr/state': '[[REDACTED]]',

            '/events/0/message/payload': '[[REDACTED]]',
            '/events/2/message/payload': '[[REDACTED]]',
            '/events/4/message/payload': '[[REDACTED]]',
            '/events/7': {
                '_id': BaselineDeltas.AnyObjectId(),
                'correlationId': BaselineDeltas.AnyObjectId(),
                'sessionId': BaselineDeltas.AnyObjectId(),
                'timestamp': BaselineDeltas.AnyDate(),
                'collectionName': 'subject',
                'channelId': ids(/Charlie2/),
                'subChannelKey': 'gdpr',
                'message/personnelId': ids(/ROOT/),
                'message/type': 'MAKE_CLEAN',
                'message/payload/~1$set': {
                    '~1gdpr~1_rohrpostMetadata~1EXECUTED_MAKE_CLEAN': true,
                    '~1gdpr~1state': '[[REDACTED]]',
                }
            }
        }, asFlatEJSON: true });
    });
});
