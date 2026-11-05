'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var endpoints = require('../../../src');

var endpoint = endpoints.study.readManyLabels;

describe('study/read-many-labels wip', function () {
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
                    '64d42dcb443aa279ca4caeee',
                    '68ccfb686ca64f6895d6e483',
                ]}
            }
        });

        await endpoint(koaContext, async () => {});
        console.dir(ejson(koaContext.body), { depth: null });
    });

});
