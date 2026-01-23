'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit, without } = require('@mpieva/psydb-core-utils');
var { ApiError, aggregateToArray } = require('@mpieva/psydb-api-lib');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../../src/');

describe('csv-import/subject/create-default fs-uganda', function () {

    var subjectType = 'fs_uganda_subject';
    var researchGroupId = ObjectId("6861fcb19e48252d4dcb73f7");

    var db, sendMessage;
    beforeEach(async function () {
        await this.restore('2025-09-17__0731');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

    });

    it('full import w/o parentIds', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-uganda-full'),
        });

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        console.ejson(subjects);
    });
    
    it('full import with parentIds', async function () {
        var { _id: fileIdBase } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-uganda-parent-ids'),
        });
        await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({
                researchGroupId, subjectType, fileId: fileIdBase
            })
        });
        
        var { _id: fileIdParents } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-uganda-parent-ids'),
        });
        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({
                researchGroupId, subjectType, fileId: fileIdParents
            })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        console.ejson(subjects);
    });
})
