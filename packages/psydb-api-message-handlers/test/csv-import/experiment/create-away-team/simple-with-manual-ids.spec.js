'use strict';
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { ObjectId, aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var tprefix = require('./t-prefix');
describe(`${tprefix} simple-with-manual-ids`, function () {
    var db, ids, send;
    before(async function () {
        ids = await this.restore([
            '2026-07-24__0243'
        ], { gatherIds: true });
        
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));
        
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/away-team/simple-with-manual-ids'
        )});
        
        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/experiment/create-away-team',
            timezone: 'Europe/Berlin',
            payload: {
                studyId: ids('Kiga-Study'),
                subjectType: 'child',
                locationType: 'kiga',
                fileId: file._id,
                //treatEachLineAsSeperateExperiment: false,
                //skipPossibleDuplicates: false,
            }
        }));
        
        console.log(csvImportId);
        var experiments = await aggregateToArray({ db, experiment: {
            csvImportId,
        }});
        console.ejson(experiments);
    });
});
