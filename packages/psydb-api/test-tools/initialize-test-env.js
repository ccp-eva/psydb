'use strict';
var Koa = require('koa');
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');

var createAgent = require('@mpieva/psydb-axios-test-wrapper');
var Driver = require('@mpieva/psydb-driver-nodejs');
var fixtures = require('@mpieva/psydb-fixtures');
var withApi = require('../src/middleware/api');

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
            from: fixtures.get(fixtureName, { db: true })
        })
        this.context.bsonIds = fixtures.bsonIds;

        return out;
    };

    this.createKoaApi = (options = {}) => {
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
        
        var agent = createAgent(app.callback(), { enableCookies: true });
        var driver = Driver({ agent });

        this.context.api.app = app;
        this.context.api.agent = agent;
        this.context.api.driver = driver;
        
        return { app, agent, driver };
    }

    this.getApiAgent = () => (
        this.context.api.agent
    );

    this.signIn = async () => {
        await this.context.api.driver.signIn({
            email: 'root@example.com',
            password: 'test1234'
        })
    }

    this.signOut = async () => {
        await this.context.api.driver.signOut()
        this.context.api.agent?.close();
    }
}

var beforeEach = async function () {}

var afterEach = async function () {
    await mongoHelpers.clean(this.context.mongo)();
}

var afterAll = async function () {
    this.context.api.agent?.close();
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
