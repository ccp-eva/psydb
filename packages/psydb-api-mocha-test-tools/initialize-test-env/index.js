'use strict';
// NOTE: using this and step() instead of it() will prevent
// later steps from being executed after an error; it() would execute 
// all the steps after an error regardless which is undesireable
// due to bloated error output
require('../mocha-async-step');

var locale = require('date-fns/locale/de');

var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');

var { ejson } = require('@mpieva/psydb-core-utils');

var doConnectLocal = require('./do-connect-local');
var doRestore = require('./do-restore');
var createKoaContext = require('./create-koa-context');

console.ejson = (that, options = {}) => {
    console.dir(ejson(that), { depth: null, ...options })
}

var beforeAll = async function () {
    this.context = {
        mongo: {},
        i18n: { timezone: 'Europe/Berlin', language: 'de', locale }
    };
    
    await mongoHelpers.startup(this.context.mongo)();

    this.getMongoContext = () => {
        return this.context.mongo.local || this.context.mongo;
    }

    this.getI18N = () => {
        return this.context.i18n;
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
