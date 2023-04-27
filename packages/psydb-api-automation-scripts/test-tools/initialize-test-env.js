'use strict';
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');
var createAgent = require('@mpieva/psydb-axios-test-wrapper');

var supertest = require('supertest');

var Koa = require('koa');
var withApi = require('@mpieva/psydb-api');
var executeWithDriver = require('../src/execute-with-driver');

var beforeAll = async function () {
    this.context = {
        mongo: {},
        api: {},
    };
    
    await mongoHelpers.startup(this.context.mongo)();

    this.getDbHandle = () => {
        return this.context.mongo.dbHandle;
    }
    
    this.restore = async (fixtureName) => {
        var out = await restore.database({
            con: this.context.mongo.client,
            database: this.context.mongo.dbName,
            clean: true,
            from: fixtures(fixtureName, { db: true })
        })

        return out;
    };

    this.execute = async (lambda) => {
        var app = new Koa();
        app.use(async (context, next) => {
            await next();
            context.mongoConnector.close();
        });
        app.use(withApi({ app, config: {
            db: {
                url: this.context.mongo.uri,
                dbName: this.context.mongo.dbName,
                useUnifiedTopology: true,
            }
        }}));

        var agent = createAgent(app.callback());
        var out = await executeWithDriver({ agent, script: lambda })
        agent.close();
        return out;
    }
}

var beforeEach = async function () {}

var afterEach = async function () {
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
