'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var endpoints = require('../../../src');

//var endpoint = endpoints.study.extendedSearch;

describe('study/extended-search', function () {
    var db, session;
    beforeEach(async function () {
        //db = await this.restore('2024-03-29__1914_fieldsites');
        db = await this.connectLocal();
        session = await this.createFakeSession('root@example.com');
    });

    it('stub', async function () {
        var koaContext = this.createKoaContext({
            ...session,
            reuqest: { body: {}}
        });

        //await endpoint(koaContext, async () => {});
    });

});
