'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-api-lib');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../src/');

describe('csv-import/experiment/create-wkprc-apestudies-default', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        //await this.restore('2024-04-03__0435_wkprc-and-fs');
        await this.restore('2025-09-22__1105');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

        //var file = await this.createFakeFileUpload({
        //    db, buffer: loadCSV('evapecognition/simple'),
        //});
    });

    it.skip('does the thing (simple)', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV(
                'experiment-csv/wkprc-apestudies-default/simple'
            ),
        });

        var studyId = ObjectId('6566b5c26c830cb226c1389b');
        var subjectType = 'wkprc_chimpanzee';

        var koaContext = await sendMessage({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, studyId, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        console.log(csvImportId);

        var experiments = await aggregateToArray({ db, experiment: [
            { $match: { csvImportId }}
        ]});
        console.dir(ejson(experiments), { depth: null });
    });

    it('does the thing (combination)', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV(
                'experiment-csv/wkprc-apestudies-default/combination'
            ),
        });

        var studyId = ObjectId('6566b5c26c830cb226c1389b');
        var subjectType = 'wkprc_chimpanzee';

        var koaContext = await sendMessage({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, studyId, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        console.log(csvImportId);

        var experiments = await aggregateToArray({ db, experiment: [
            { $match: { csvImportId }}
        ]});
        console.dir(ejson(experiments), { depth: null });
    });

    it.only('mono-comment issue', async function () {
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV(
                'experiment-csv/wkprc-apestudies-default/combination-with-mono-comment'
            ),
        });

        var studyId = ObjectId('6566b5c26c830cb226c1389b');
        var subjectType = 'wkprc_chimpanzee';

        var koaContext = await sendMessage({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: jsonify({ subjectType, studyId, fileId })
        });

        var { csvImportId } = koaContext.response.body.data;
        console.log(csvImportId);

        var experiments = await aggregateToArray({ db, experiment: [
            { $match: { csvImportId }}
        ]});
        console.dir(ejson(experiments), { depth: null });
    });
});
