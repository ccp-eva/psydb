'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../../src');
var { runPipeline } = require('../../../src/csv-import-utils/subject-default');

describe('csv-import-utils/subject-default/runPipeline()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2024-03-29__1914_fieldsites');
        db = this.getDbHandle();
    });

    it('fs-malaysia', async function () {
        var subjectCRT = await fetchCRTSettings({
            db,
            collectionName: 'subject', recordType: 'fs_malaysia_subject',
            wrap: true
        });

        var data = loadCSV('subject-import/fs-malaysia');
        var out = await runPipeline({
            db,
            csvLines: data,
            timezone: 'Europe/Berlin',

            subjectCRT,
            researchGroup: ObjectId("64d42dde443aa279ca4cb2ae"),
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(out), { depth: null });
    });

});
