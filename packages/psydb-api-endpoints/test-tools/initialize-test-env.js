'use strict';
var tenv = require('@mpieva/psydb-api-mocha-test-tools/initialize-test-env');

var { Permissions } = require('@mpieva/psydb-common-lib');
var { Self } = require('@mpieva/psydb-api-lib');

var [ createContext ] = tenv.mochaHooks.beforeAll;

var beforeAll = async function () {
    await createContext.call(this);

    this.createFakeSession = async (bag) => {
        if (typeof bag === 'string') {
            bag = { email: bag }
        }

        var { email } = bag;

        var db = this.getDbHandle();
        var self = await Self({ db, query: {
            'gdpr.state.emails.email': email
        }});
        
        var permissions = Permissions.fromSelf({ self });

        return {
            session: { personnelId: self.record._id },
            self,
            permissions,
        }
    }
}

module.exports = {
    mochaHooks: {
        ...tenv.mochaHooks,
        beforeAll: [ beforeAll ],
    }
}
