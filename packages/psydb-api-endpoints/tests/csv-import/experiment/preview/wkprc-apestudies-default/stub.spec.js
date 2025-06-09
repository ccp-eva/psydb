'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var endpoints = require('../../../../../src');
var endpoint = (
    endpoints.csvImport.experiment.preview['wkprc-apestudies-default']
);

describe('csv-import/experiment/preview/wkprc-apestudies-default', function () {
    var db, session, file;
    beforeEach(async function () {
        db = await this.restore('2025-06-09__1835');
        session = await this.createFakeSession('root@example.com');
        file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/wkprc-apestudies-default/combination'
        )});
    });

    it('stub', async function () {
        var koaContext = this.createKoaContext({
            ...session,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: {
                    fileId: String(file._id),
                    subjectType: 'wkprc_chimpanzee',
                    studyId: '670d7c608c7129131ebeb883',
                }
            }
        });

        await endpoint(koaContext, async () => {});
        console.dir(ejson(koaContext.body), { depth: null });
    });

});
