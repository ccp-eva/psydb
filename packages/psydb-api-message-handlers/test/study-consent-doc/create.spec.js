'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { jsonify } = require('@mpieva/psydb-core-utils');
var { ObjectId, aggregateOne } = require('@mpieva/psydb-mongo-adapter');

describe('study-consent-doc/create', function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            'tiny_2026-01-28__0437__consent-doc-starter',
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    step('create', async function () {
        console.ejson(ids.all());

        var deltas = BaselineDeltas();
        deltas.push(await this.fetchAllRecords('studyConsentDoc'));

        var payload = {
            'studyConsentFormId': ids('Tiny-Test'),
            'subjectId': ids('Test Kind, Alice'),
            'labOperatorIds': [ ids('root@example.com') ],
            'props': {
                'elementValues': {
                    '2': 'Test Parent, Elenor',
                    '3': 'Alice',
                    '4': 'Test Kind',
                    '6': true
                }
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-consent-doc/create',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        deltas.push(await this.fetchAllRecords('studyConsentDoc'));
        var studyConsentFormSnapshot = await (
            aggregateOne({ db, studyConsentForm: { '_id': ids('Tiny-Test') }})
        );
        deltas.test({ expected: {
            '/0/_id': channelId,
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/studyId': ids('IH-Study'),
            '/0/studyConsentFormId': ids('Tiny-Test'),
            '/0/subjectId': ids('Test Kind, Alice'),
            '/0/personnelId': ids('root@example.com'),
            '/0/labOperatorIds': [ ids('root@example.com') ],
            '/0/subjectType': 'child',
            '/0/state': {
                ...PROPS_AS_STATE(payload).state,
                'studyConsentFormSnapshot': studyConsentFormSnapshot,
            }
        }, asFlatEJSON: true });
    })
})
