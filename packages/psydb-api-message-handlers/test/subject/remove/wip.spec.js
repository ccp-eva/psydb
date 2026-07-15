'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('subject/remove', function () {
    var db, ids, sendMessage;
    before(async function () {
        ids = await this.restore('2026-03-24__0113', { gatherIds: true });
        db = this.getDbHandle();

        var login = await this.createFakeLogin({ email: 'root@example.com' });
        ([ sendMessage ] = this.createMessenger({ ...login }));
    });

    it('does mrproper', async function () {
        var _id = ids(/Charlie2/);

        var deltas = BaselineDeltas();
        deltas.push(await this.aggregateAll([
            [ 'subject', { _id } ],
            [ 'rohrpostEvents', { channelId: _id } ]
        ]));

        var payload = { _id };

        await sendMessage({
            type: 'subject/remove', timezone: 'Europe/Berlin',
            payload
        });
       
        var updated = await this.aggregateAll([
            [ 'subject', { _id } ],
            [ 'rohrpostEvents', { channelId: _id } ]
        ]);
        var mrproperEvent = updated.rohrpostEvents.splice(-1)[0];
        deltas.push({ ...updated, mrproperEvent });

        var expected = {};
        var { DeletedValue } = BaselineDeltas;

        expected['/subject'] = [];
        expected['/rohrpostEvents/0/message/payload'] = DeletedValue();
        expected['/rohrpostEvents/1/message/payload'] = DeletedValue();
        expected['/rohrpostEvents/2'] = DeletedValue();
        expected['/rohrpostEvents/3'] = DeletedValue();
        expected['/rohrpostEvents/4'] = DeletedValue();
        expected['/rohrpostEvents/5'] = DeletedValue();
        expected['/rohrpostEvents/6'] = DeletedValue();

        expected['/mrproperEvent'] = {
            '_id': BaselineDeltas.AnyObjectId(),
            'correlationId': BaselineDeltas.AnyObjectId(),
            'sessionId': BaselineDeltas.AnyObjectId(),
            'timestamp': BaselineDeltas.AnyDate(),
            'collectionName': 'subject',
            'channelId': ids(/Charlie2/),
            'message/personnelId': ids(/ROOT/),
            'message/type': 'MAKE_MRPROPER',
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
    
    it('throws when participations', async function () {
        var _id = ids(/Test Kind, Alice/);
        var error = undefined;
        try {
            await sendMessage({
                type: 'subject/remove', timezone: 'Europe/Berlin',
                payload: { _id }
            });
        }
        catch (e) {
            error = e;
        }

        expect(error).to.exist;
    });
});
