'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var endpoints = require('../../../src');

var endpoint = endpoints.personnel.readManyLabels;

describe('personnel/read-many-labels wip', function () {
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
                body: { ids: [
                    '64d42dd4443aa279ca4cb098',
                    '64d42dc8443aa279ca4cae9c',
                ]}
            }
        });

        await endpoint(koaContext, async () => {});
        console.dir(ejson(koaContext.body), { depth: null });
    });

});
