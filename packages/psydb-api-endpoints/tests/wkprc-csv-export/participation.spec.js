'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var endpoints = require('../../src');

var endpoint = endpoints.wkprcCSVExport.participation;

describe('wkprc-csv-export/participation', function () {
    var db, session;
    beforeEach(async function () {
        //db = await this.restore('2024-03-29__1914_fieldsites');
        db = await this.connectLocal();
        session = await this.createFakeSession('root@example.com');
    });

    it('stub', async function () {
        var koaContext = this.createKoaContext({
            ...session,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: {
                    studyId: '6566b5c26c830cb226c1389b',
                    subjectType: 'wkprc_chimpanzee',
                }
            }
        });

        await endpoint(koaContext, async () => {});
        console.dir(ejson(koaContext.body), { depth: null });
    });

});
