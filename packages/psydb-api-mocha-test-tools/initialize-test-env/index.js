'use strict';
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');

var doConnectLocal = require('./do-connect-local');
var doRestore = require('./do-restore');
var createKoaContext = require('./create-koa-context');

var beforeAll = async function () {
    this.context = {
        mongo: {},
    };
    
    await mongoHelpers.startup(this.context.mongo)();

    this.getMongoContext = () => {
        return this.context.mongo.local || this.context.mongo;
    }

    this.getDbHandle = () => {
        var { dbHandle } = this.getMongoContext();
        return dbHandle;
    }

    this.connectLocal = (...a) => doConnectLocal.call(this, ...a);
    this.restore = (...a) => doRestore.call(this, ...a);
    this.createKoaContext = (...a) => createKoaContext.call(this, ...a);

    
    this.fetchAllRecords = (collection) => {
        var db = this.getDbHandle();
        return db.collection(collection).find().toArray();
    }
}

var beforeEach = async function () {}

var afterEach = async function () {
    var { local } = this.context.mongo;
    if (local) {
        var { client, dbHandle, dbName } = local;
        client.close();
        delete this.context.mongo.local;
    }
    await mongoHelpers.clean(this.context.mongo)();
}

var afterAll = async function () {
    await mongoHelpers.teardown(this.context.mongo)();
}

module.exports = {
    mochaHooks: {
        beforeAll: [ beforeAll ],
        beforeEach: [ beforeEach ],
        afterEach: [ afterEach ],
        afterAll: [ afterAll ]
    }
}
