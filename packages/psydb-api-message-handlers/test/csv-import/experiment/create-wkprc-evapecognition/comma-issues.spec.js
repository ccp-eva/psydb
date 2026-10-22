'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

// NOTE: comment column contains a comma ("some,comment") while
// the csv delimiter is ";"; we only check that the import goes
// through and creates the experiment
var tprefix = require('./t-prefix');
describe(`${tprefix} comma-issues`, function () {
    var db, ids, send;

    before(async function () {
        ids = await this.restore([ 'wkprc-stub-2026-10-08' ], {
            gatherIds: true
        });

        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

        db = this.getDbHandle();
    });

    step('create from csv with comma in comment', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/comma-issues'
        )});

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: {
                studyId: ids('WKPRC Test Study'),
                subjectType: 'wkprc_chimpanzee',
                fileId: file._id,
                skipPossibleDuplicates: false,
            }
        }));

        var experiments = await aggregateToArray({ db, experiment: {
            csvImportId,
        }});

        expect(experiments).to.have.length(1);
        var [{ state }] = experiments;
        expect(state.experimentName).to.eql('choice_task');
        expect(state.subjectData.map(it => it.comment)).to.eql([
            'some,comment', ''
        ]);
    });
});
