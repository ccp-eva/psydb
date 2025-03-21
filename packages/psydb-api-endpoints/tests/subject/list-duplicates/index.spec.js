'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var apiConfig = require('@mpieva/psydb-api-config');
var endpoints = require('../../../src');

var endpoint = endpoints.subject.listDuplicates;

describe('subject/list-duplicates', function () {
    var db, session;
    beforeEach(async function () {
        //db = await this.restore('2024-03-29__1914_fieldsites');
        db = await this.connectLocal();
        session = await this.createFakeSession('root@example.com');
    });

    it('stub', async function () {
        var koaContext = this.createKoaContext({
            ...session, apiConfig,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: {
                    recordType: 'child',
                    inspectedPointers: [
                        '/gdpr/state/custom/lastname'
                    ],
                    sort: {
                        path: 'gdpr.state.custom.lastname',
                        direction: 'asc'
                    }
                }
            }
        });

        await endpoint(koaContext, async () => {});
        console.dir(ejson(koaContext.body), { depth: null });
    });

});
