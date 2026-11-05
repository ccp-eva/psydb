'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { createStudyProps, createRoadmapProps } = require('./__helpers');

describe('study/patch roadmap-newversion', function () {
    var db, ids, send, now, roadmapId;
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
        
        var initpayload = {
            '_id': ids('IH-Study'),
            'props': createStudyProps({ ids }),
            'studyRoadmap': { 'props': createRoadmapProps({ ids }) }
        };

        var [ _unused, roadmapMeta ] = await KOA_CHANNELS(send({
            type: 'study/patch', timezone: 'Europe/Berlin',
            payload: initpayload
        }));
        
        roadmapId = roadmapMeta.channelId;
    });

    it('does the thing', async function () {
        var deltas = BaselineDeltas();
        deltas.push({
            'study': await this.fetchAllRecords('study'),
            'roadmap': await this.fetchAllRecords('studyRoadmap'),
        });

        var { tasks } = deltas.getCurrent_RAW().roadmap[0].state;
        var payload = {
            '_id': ids('IH-Study'),
            'props': createStudyProps({ ids }),
            'studyRoadmap': {
                'props': createRoadmapProps({ ids, overrides: {
                    '/tasks/0/_id': tasks[0]._id,
                    '/tasks/1/_id': tasks[1]._id,
                    '/tasks/1/description': 'NEW DESCRIPTION',
                    '/tasks/2/_id': tasks[2]._id,
                }})
            }
        };

        await KOA_CHANNELS(send({
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
            },
            '/roadmap/0': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/tasks/1/description': 'NEW DESCRIPTION'
            },
        }, asFlatEJSON: true });
    })
})
