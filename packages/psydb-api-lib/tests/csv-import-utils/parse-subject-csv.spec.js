'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { fetchCRTSettings } = require('../../src');
var { parseSubjectCSV } = require('../../src/csv-import-utils');

describe('csv-import-utils/parseSubjectCSV()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2024-03-29__1914_fieldsites');
        db = this.getDbHandle();
    });

    it('fs-malaysia', async function () {
        var data = loadCSV('subject-import/fs-malaysia');
        var subjectCRT = await fetchCRTSettings({
            db,
            collectionName: 'subject', recordType: 'fs_malaysia_subject',
            wrap: true
        });
        var parsedLines = parseSubjectCSV({ data, subjectCRT });
        //console.dir(ejson(parsed), { depth: null });
        console.log(parsedLines[0]);
    });

});
