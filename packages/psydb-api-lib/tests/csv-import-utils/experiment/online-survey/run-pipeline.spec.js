'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var { ExperimentCSV } = require('../../../../src/csv-import-utils/');

describe('csv-import-utils/experiment-csv/online-survey/runPipeline()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2024-07-12__0202_wkprc-fieldsite');
        db = this.getDbHandle();
    });

    it('simple', async function () {
        var data = loadCSV(
            'experiment-csv/online-survey/simple'
        );
        var out = await ExperimentCSV.OnlineSurvey.runPipeline({
            db,
            csvLines: data,

            timezone: 'Europe/Berlin',
            subjectType: 'fs_congo_subject',
            study: ObjectId("6566b5c26c830cb226c1389b"),
        });
        //console.dir(ejson(parsed), { depth: null });
        console.dir(ejson(out), { depth: null });
    });
});
