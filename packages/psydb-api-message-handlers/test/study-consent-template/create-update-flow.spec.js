'use strict';
var chai = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var { jsonify } = require('@mpieva/psydb-core-utils');
var { ObjectId, aggregateOne } = require('@mpieva/psydb-mongo-adapter');

describe('study-consent-template/[create|update] flow', function () {
    var db, ids, send;
    beforeEach(async function () {
        ids = await this.restore([
            'tiny_2025-11-21__0632__consent-flow-starter'
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
    });

    step('create', async function () {
        console.ejson(ids.all());
        //var deltas = BaselineDeltas();
        //deltas.push(await this.fetchAllRecords(''));
    })
})

