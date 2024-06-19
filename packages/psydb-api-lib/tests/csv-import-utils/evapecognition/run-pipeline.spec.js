'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { runPipeline } = require('../../../src/csv-import-utils/evapecognition');

describe('csv-import-utils/evapecognition/runPipeline()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2023-11-29__0517-wkprc-fieldsite');
        db = this.getDbHandle();
    });

    it.skip('simple', async function () {
        var data = loadCSV('evapecognition/simple');
        var out = await runPipeline({
            db,
            csvLines: data,

            timezone: 'Europe/Berlin',
            subjectType: 'wkprc_chimpanzee',
            study: ObjectId("6566b5c26c830cb226c1389b"),
            location: ObjectId("64d42ddf443aa279ca4cb2e5"),
            labOperators: [ ObjectId("64d42ddf443aa279ca4cb2c9") ],
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(out), { depth: null });
    });

    it('invalid-value', async function () {
        var data = loadCSV('evapecognition/invalid-value');
        var out = await runPipeline({
            db,
            csvLines: data,

            timezone: 'Europe/Berlin',
            subjectType: 'wkprc_chimpanzee',
            study: ObjectId("6566b5c26c830cb226c1389b"),
            location: ObjectId("64d42ddf443aa279ca4cb2e5"),
            labOperators: [ ObjectId("64d42ddf443aa279ca4cb2c9") ],
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(out), { depth: null });
    });
});
