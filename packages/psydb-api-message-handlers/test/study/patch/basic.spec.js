'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('study/patch basic', function () {
    var db, ids, send, now;
    beforeEach(async function () {
        ids = await this.restore([
            'tiny_2026-03-25__1746__study-crud',
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        now = new Date();

        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' },
            now,
        }));
    });

    it('does the thing', async function () {
        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('study'));

        var payload = { '_id': ids('IH-Study'), 'props': {
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
        }};

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study/patch', timezone: 'Europe/Berlin',
            payload: payload
        }));
        
        deltas.push(await this.fetchAllRecords('study'));
        deltas.test({ expected: { '/0': {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'state/name': 'Foo-Study2',
            'state/shorthand': 'Foo2',
            'state/researchGroupIds/1': BaselineDeltas.DeletedValue(),
            'state/systemPermissions/accessRightsByResearchGroup/1': (
                BaselineDeltas.DeletedValue()
            )
        }}, asFlatEJSON: true });
    })
})
