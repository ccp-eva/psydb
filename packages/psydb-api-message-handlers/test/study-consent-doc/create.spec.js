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
            'tiny_2025-11-24__1002__consent-doc-starter'
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
            'studyConsentDocId': ids('Tiny-Test'),
            'subjectId': ids('Test Kind, Alice'),
            'props': {
                '2': 'Test Parent, Elenor',
                '3': 'Alice',
                '4': 'Test Kind',
                '6': true
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study-consent-doc/create',
            timezone: 'Europe/Berlin',
            payload: payload
        }));

        deltas.push(await this.fetchAllRecords('studyConsentDoc'));
        deltas.test({ expected: [{
            '_id': channelId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            ...PROPS_AS_STATE(payload),
        }], asFlatEJSON: true });
    })
})
