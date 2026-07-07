'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

describe('create-followup-awayteam baseline', function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            'tiny_2026-07-07__0336__create-followup-awayteam'
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    it('subjectOp = copy', async function () {
        var expdeltas = BaselineDeltas();
        var subdeltas = BaselineDeltas();
        expdeltas.push(await this.fetchAllRecords('experiment'));
        subdeltas.push(await this.fetchAllRecords('subject'));

        var sourceExperimentId = new ObjectId('6a4c4ff88164a7db5d461b8a');
        var targetLabTeamId = new ObjectId('64d42dcc443aa279ca4caf15');
        var payload = {
            sourceExperimentId,
            'targetExperimentOperatorTeamId': targetLabTeamId,
            'targetInterval': {
                'start': '2026-07-16T22:00:00.000Z',
                'end': '2026-07-17T21:59:59.999Z',
            },
            'subjectOp': 'copy',
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'experiment/create-followup-awayteam',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        expdeltas.push(await this.fetchAllRecords('experiment'));
        subdeltas.push(await this.fetchAllRecords('subject'));

        expdeltas.test({ expected: { '/1': {
            '_id': channelId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'type': 'away-team',
            'state': {
                'color': '',
                'comment': '',
                'experimentOperatorIds': [],
                'experimentOperatorTeamId': targetLabTeamId,
                'generalComment': '',
                'interval': {
                    'start': new Date('2026-07-16T22:00:00.000Z'),
                    'end': new Date('2026-07-17T21:59:59.999Z'),
                },
                'isCanceled': false,
                'isPostprocessed': false,
                'locationId': ids(/Kigaweg 1/),
                'locationRecordType': 'kiga',
                'selectedSubjectGroupIds': [],
                'selectedSubjectIds': [
                    ids(/Charlie/), ids(/Mallory/),
                ],
                'seriesId': BaselineDeltas.AnyObjectId(),
                'studyId': ids(/Kiga-Study/),
                'subjectData': [
                    {
                        'subjectId': ids(/Charlie/),
                        'subjectType': 'child',
                        'invitationStatus': 'scheduled',
                        'participationStatus': 'unknown',
                        'comment': '',
                    },
                    {
                        'subjectId': ids(/Mallory/),
                        'subjectType': 'child',
                        'invitationStatus': 'scheduled',
                        'participationStatus': 'unknown',
                        'comment': '',
                    }
                ],
                'labTeamColor': "#8abdff",
            }
        }}, asFlatEJSON: true });

        //subdeltas.test({ expected: {
        //    // FIXME: expecting no changes but baseline cant handle
        //}, asFlatEJSON: true });
    })

})
