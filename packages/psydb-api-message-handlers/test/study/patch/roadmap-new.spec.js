'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('study/patch roadmap-new', function () {
    var db, ids, send, now;
    beforeEach(async function () {
        ids = await this.restore([
            'tiny_2026-03-25__1746__study-crud',
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        now = new Date();

        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' },
            apiConfig: { dev_enableStudyRoadmap: true },
            now,
        }));
    });

    it('does the thing', async function () {
        var deltas = BaselineDeltas();
        deltas.push({
            'study': await this.fetchAllRecords('study'),
            'roadmap': await this.fetchAllRecords('studyRoadmap'),
        });

        var payload = {
            '_id': ids('IH-Study'),
            'props': {
                'name': 'Foo-Study2',
                'shorthand': 'Foo2',
                'runningPeriod': {
                    'start': new Date('2001-01-01T00:00:00Z'),
                    'end': null
                },
                'researchGroupIds': [ ids('ChildLab') ],
                'systemPermissions': {
                    'accessRightsByResearchGroup': [{
                        'researchGroupId': ids('ChildLab'),
                        'permission': 'write'
                    }],
                    'isHidden': false,
                },
                
                'custom': {
                    'assistents': [ ids('Test RA ChildLab') ],
                    'novels': [],
                    'description': '',
                },
            },
            'studyRoadmap': { 'props': { 'tasks': {
                'u3GD': {
                    'start': new Date('2020-01-01T00:00:00Z'),
                    'end': new Date('2020-03-31T00:00:00Z'),
                    'description': 'project prep, study design',
                    'status': 'finished',
                    'assignedTo': ids('Test RA ChildLab')
                },
                'Ry-a': {
                    'start': new Date('2020-03-01T00:00:00Z'),
                    'end': new Date('2020-05-31T00:00:00Z'),
                    'description': 'data acquisition & analysis',
                    'status': 'ongoing',
                    'assignedTo': ids('Test RA ChildLab')
                },
                'gsV_': {
                    'start': new Date('2020-06-01T00:00:00Z'),
                    'end': new Date('2020-07-31T00:00:00Z'),
                    'description': 'publication',
                    'status': 'planned',
                    'assignedTo': ids('Test RA ChildLab')
                },
            }}}
        };

        var [
            { channelId: studyId },
            { channelId: roadmapId }
        ] = await KOA_CHANNELS(send({
            type: 'study/patch', timezone: 'Europe/Berlin',
            payload: payload
        }));
        
        deltas.push({
            'study': await this.fetchAllRecords('study'),
            'roadmap': await this.fetchAllRecords('studyRoadmap'),
        });
        deltas.test({ expected: {
            '/study/0': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/name': 'Foo-Study2',
                'state/shorthand': 'Foo2',
                'state/researchGroupIds/1': BaselineDeltas.DeletedValue(),
                'state/systemPermissions/accessRightsByResearchGroup/1': (
                    BaselineDeltas.DeletedValue()
                )
            },
            '/roadmap/0': {
                '_id': roadmapId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'studyId': studyId,
                'state': {
                    ...PROPS_AS_STATE(payload.studyRoadmap).state,
                },
            }
        }, asFlatEJSON: true });
    })
})
