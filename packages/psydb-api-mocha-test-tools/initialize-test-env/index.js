'use strict';
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');

var doConnectLocal = require('./do-connect-local');
var doRestore = require('./do-restore');

var beforeAll = async function () {
    this.context = {
        mongo: {},
    };
    
    await mongoHelpers.startup(this.context.mongo)();

    var getMongoContext = () => {
        return this.context.mongo.local || this.context.mongo;
    }

    this.getDbHandle = () => {
        var { dbHandle } = getMongoContext();
        return dbHandle;
    }

    this.connectLocal = (...args) => doConnectLocal.call(this, ...args);
    this.restore = (...args) => doRestore.call(this, ...args);
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
