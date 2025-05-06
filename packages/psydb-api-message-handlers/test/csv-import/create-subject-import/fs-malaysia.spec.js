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

describe('csv-import/subject/create-default fs-malaysia', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        await this.restore('2024-08-30__0902');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

        var file = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-malaysia'),
        });
        fileId = file._id;
    });

    it('does the thing', async function () {
        var subjectType = 'fs_malaysia_subject';
        var researchGroupId = ObjectId("64d42dd0443aa279ca4caff8");

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({
                researchGroupId,
                subjectType,
                fileId,
            })
        });

        var { csvImportId } = koaContext.response.body.data;
        console.log(csvImportId);
        
        var imports = await db.collection('csvImport').find().toArray();
        //console.dir(ejson(imports), { depth: null });
        
        //var subjects = await db.collection('subject').find().toArray();
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        console.dir(ejson(subjects), { depth: null });
    })
})
