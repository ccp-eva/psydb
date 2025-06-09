'use strict';
var tenv = require('@mpieva/psydb-api-mocha-test-tools/initialize-test-env');

var { Permissions } = require('@mpieva/psydb-common-lib');
var { Self, createId, withRetracedErrors } = require('@mpieva/psydb-api-lib');

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
    
    this.createFakeFileUpload = async (bag) => {
        var {
            buffer,
            mimetype = 'text/csv',
            originalFilename = 'import.csv',
        } = bag;

        var db = this.getDbHandle();

        var mongoDoc = {
            _id: await createId(),
            correlationId: await createId(),
            createdBy: await createId(),
            createdAt: new Date(),
            uploadKey: 'import',
            hash: 'xxx',
            mimetype,
            originalFilename,
            blob: buffer
        }

        await withRetracedErrors(
            db.collection('file').insertOne(mongoDoc)
        );

        return mongoDoc;
    }
}

module.exports = {
    mochaHooks: {
        ...tenv.mochaHooks,
        beforeAll: [ beforeAll ],
    }
}
