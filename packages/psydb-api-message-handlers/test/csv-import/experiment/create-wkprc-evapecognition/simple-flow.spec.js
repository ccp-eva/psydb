'use strict';
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { ObjectId, aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var tprefix = require('./t-prefix');
describe(`${tprefix} simple-flow`, function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            '2026-01-23__0620'
        ], { gatherIds: true });
        
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
        
        db = this.getDbHandle();
    });

    step('create simple', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/wkprc-apestudies-default/simple'
        )});
        
        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: {
                studyId: ids('dddd'), // best study name lol
                subjectType: 'wkprc_chimpanzee',
                fileId: file._id,
                skipPossibleDuplicates: false,
            }
        }));
        
        //console.log(csvImportId);
        //var experiments = await aggregateToArray({ db, experiment: {
        //    csvImportId,
        //}});
        //console.ejson(experiments);
    });
    
    step('create simple w/ skipped duplicates', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/wkprc-apestudies-default/simple-step2'
        )});
        
        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: {
                studyId: ids('dddd'), // best study name lol
                subjectType: 'wkprc_chimpanzee',
                fileId: file._id,
                skipPossibleDuplicates: true,
            }
        }));
        
        console.log(csvImportId);
        var experiments = await aggregateToArray({ db, experiment: {
            csvImportId,
        }});
        console.ejson(experiments);
    });
});
