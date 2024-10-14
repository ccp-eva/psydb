'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit, without } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-api-lib');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../../src/');

describe('csv-import/experiment/create-manual-only-participation', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        await this.restore('2024-07-12__0202_wkprc-fieldsite');
        db = this.getDbHandle();

        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/manual-only-participation/simple'
        )});
        fileId = file._id;
    });

    it('does the thing', async function () {
        var locationType = 'fs_congo_location';
        var subjectType = 'fs_congo_subject';
        var studyId = ObjectId('64d42dd7443aa279ca4cb116');

        var koaContext = await sendMessage({
            type: 'csv-import/experiment/create-manual-only-participation',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                studyId,
                subjectType,
                locationType,
                fileId,
            })
        });

        var { csvImportId } = koaContext.response.body.data;
        console.log(csvImportId);
        
        var imports = await db.collection('csvImport').find().toArray();
        console.dir(ejson(imports), { depth: null });
        
        //var subjects = await db.collection('subject').find().toArray();
        //var subjects = await aggregateToArray({ db, subject: [
        //    { $match: { csvImportId }}
        //]});
        //console.dir(ejson(subjects), { depth: null });
    })
})
