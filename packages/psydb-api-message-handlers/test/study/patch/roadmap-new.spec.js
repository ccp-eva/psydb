'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { createStudyProps, createRoadmapProps } = require('./__helpers');

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
            'props': createStudyProps({ ids }),
            'studyRoadmap': { 'props': createRoadmapProps({ ids }) }
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
                    ...PROPS_AS_STATE(payload.studyRoadmap, { overrides: {
                        '/tasks/0/_id': BaselineDeltas.AnyObjectId(),
                        '/tasks/1/_id': BaselineDeltas.AnyObjectId(),
                        '/tasks/2/_id': BaselineDeltas.AnyObjectId(),
                    }}).state,
                },
            }
        }, asFlatEJSON: true });
    })
})
