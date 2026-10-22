'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

describe('subject/remove', function () {
    var db, ids, sendMessage;
    before(async function () {
        ids = await this.restore([
            'init-minimal',
            'tiny_2026-10-22__1606__cats-01-helper-sets-and-crts',
            'tiny_2026-10-22__1606__cats-02-roles-and-research-groups',
            'tiny_2026-10-22__1606__cats-03-personnel',
            'tiny_2026-10-22__1606__cats-04-orgs-and-locations',
            'tiny_2026-10-22__1606__cats-05-subjects',
        ], { gatherIds: true });
        db = this.getDbHandle();

        var login = await this.createFakeLogin({ email: 'root@example.com' });
        ([ sendMessage ] = this.createMessenger({ ...login }));
    });

    it('does mrproper', async function () {
        var _id = ids(/Homeownership.*Banking/);

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

        expected['/mrproperEvent'] = {
            '_id': BaselineDeltas.AnyObjectId(),
            'correlationId': BaselineDeltas.AnyObjectId(),
            'sessionId': BaselineDeltas.AnyObjectId(),
            'timestamp': BaselineDeltas.AnyDate(),
            'collectionName': 'subject',
            'channelId': ids(/Homeownership.*Banking/),
            'message/personnelId': ids(/ROOT/),
            'message/type': 'MAKE_MRPROPER',
        }

        deltas.test({ expected, asFlatEJSON: true });
    });
    
    it('throws when participations', async function () {
        var _id = ids(/Maintenance.*Snake/);
        // NOTE: tiny dumps contain no studies/participations
        await db.collection('subject').updateOne({ _id }, { $push: {
            'scientific.state.internals.participatedInStudies': {
                studyId: new ObjectId(),
                status: 'participated',
                timestamp: new Date(),
            }
        }});

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
        expect(error.message).to.include('SubjectHasStudyParticipation');
    });
});
