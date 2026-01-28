'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var endpoints = require('../../../src');

var endpoint = endpoints.location.extendedSearch;

describe('location/extendedSearch wip', function () {
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
                    locationType: 'kiga',
                    customFilters: {},
                    specialFilters: { isHidden: 'only-false' },
                    columns: [
                        '/sequenceNumber',
                        '/state/custom/address',
                        '/state/custom/supervisorId'
                    ],

                    sort: {
                        column: '/state/custom/address',
                        direction: 'asc'
                    },

                    offset: 0,
                    limit: 1000,
                    timezone: 'UTC', // TODO: deprecate
                }
            }
        });

        await endpoint(koaContext, async () => {});
        //console.ejson(koaContext.body);
    });

});
