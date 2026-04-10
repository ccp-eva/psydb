'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { SubjectContactHistoryCSV } = require('../../../src/csv-import-utils');

describe('csv-import-utils/subject-contact-history-csv/runPipeline()', function () {
    var db;
    beforeEach(async function () {
        await this.connectLocal();
        db = this.getDbHandle();
    });

    it('simple', async function () {
        var data = loadCSV(
            'subject-contact-history-csv/simple'
        );
        var out = await SubjectContactHistoryCSV.runPipeline({
            db,
            csvLines: data,

            timezone: 'Europe/Berlin',
            subjectType: 'child',
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(out), { depth: null });
    });
});
