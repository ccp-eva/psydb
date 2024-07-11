'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { runPipeline } = require('../../../src/csv-import-utils/evapecognition');

describe('csv-import-utils/evapecognition/runPipeline()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2024-06-19__0601_wkprc-fieldsite');
        db = this.getDbHandle();
    });

    it('simple', async function () {
        var data = loadCSV('wkprc-apestudies-default/simple');
        var out = await runPipeline({
            db,
            csvLines: data,

            timezone: 'Europe/Berlin',
            subjectType: 'wkprc_chimpanzee',
            study: ObjectId("6566b5c26c830cb226c1389b"),
            //location: ObjectId("64d42ddf443aa279ca4cb2e5"),
            //labOperators: [ ObjectId("64d42ddf443aa279ca4cb2c9") ],
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(out), { depth: null });
    });

    it.skip('invalid-value', async function () {
        var data = loadCSV('wkprc-apestudies-default/simple');
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
