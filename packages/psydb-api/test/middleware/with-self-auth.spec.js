'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var noop = async () => {};

var withSelfAuth = require('../../src/middleware/self-auth');

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

        var { self } = context;
        var { rolesByResearchGroupId } = self;
        console.log({ self });
        console.log({ rolesByResearchGroupId });
    })
    
})
