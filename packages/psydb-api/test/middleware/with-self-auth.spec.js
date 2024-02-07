'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var noop = async () => {};

var withSelfAuth = require('../../src/middleware/self-auth');
var withPermissions = require('../../src/middleware/permissions');

describe('middleware/with-self-auth', function () {
    var db;
    beforeEach(async function () {
        await this.connectLocal();
        db = this.getDbHandle();
    })

    it('simple auth', async function () {
        var mw = withSelfAuth();

        var session = await this.createFakeSession({ email: /root/ });

        var context = {
            db,
            session,
            request: { query: {}},
            apiConfig: {}
        }
        await mw(context, noop);

        var perm = withPermissions();
        await perm(context, noop);

        var { self } = context;
        //console.log({ self });
        var { permissions } = context;
        //console.log({ permissions });

        var flag = permissions.hasSomeLabOperationFlags({
            types: 'any',
            flags: [ 'canViewExperimentCalendar' ]
        });

        console.log({ flag });
    })
    
})
