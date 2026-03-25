'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('study/patch', function () {
    var db, ids, send;
    beforeEach(async function () {
        ids = await this.restore([
            'tiny_2026-03-25__1746__study-crud',
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    it('does the thing', async function () {
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('study'));

        var payload = { 'props': {
            'name': 'Foo-Study',
            'shorthand': 'Foo',
            'runningPeriod': {
                'start': new Date('2020-01-01T00:00:00Z'),
                'end': null
            },
            'researchGroupIds': [ ids('ChildLab') ],
            'systemPermissions': {
                'accessRightsByResearchGroup': [
                    {
                        'researchGroupId': ids('ChildLab'),
                        'permission': 'write'
                    }
                ],
                'isHidden': false,
            },
            
            'custom': {
                'assistents': [ ids('Test RA ChildLab') ],
                'novels': [],
                'description': '',
            },
        }}

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study/default/create', timezone: 'Europe/Berlin',
            payload: payload
        }));
        
        deltas.push(await this.fetchAllRecords('study'));
        deltas.test({ expected: { '/1': {
            '_id': channelId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'isDummy': false,
            'sequenceNumber': '11',
            'type': 'default',
            'state': {
                ...payload.props,
                'enableFollowUpExperiments': false,
                'excludedOtherStudyIds': [],
                'scientistIds': [],
                'studyTopicIds': [],

                'inhouseTestLocationSettings': [], // XXX obsolete
                'isCreateFinalized': true, // XXX: obsolete
            }
        }}, asFlatEJSON: true });
    })
})
