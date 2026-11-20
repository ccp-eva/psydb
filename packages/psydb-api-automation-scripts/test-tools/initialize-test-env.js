'use strict';
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');
var createAgent = require('@mpieva/psydb-axios-test-wrapper');

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
            from: fixtures.get(fixtureName, { db: true })
        })

        return out;
    };

    this.execute = async ({ script, apiKey, extraOptions, apiConfig }) => {
        var { mongo } = this.context;

        var app = new Koa();
        // NOTE: close in finally; otherwise a failing request leaves
        // the connection open and keeps mocha from exiting
        app.use(async (context, next) => {
            try {
                await next();
            }
            finally {
                await context.mongoConnector?.close();
            }
        });
        app.use(withApi({ app, config: {
            ...apiConfig,
            sessionSecret: [
                '------------------------------------------',
                'DO NOT USE IN PRODUCTION GENERATE YOUR OWN',
                '------------------------------------------',
            ].join(''),
            db: {
                url: mongo.uri,
                dbName: mongo.dbName,
                useUnifiedTopology: true,
            },
            apiKeyAuth: {
                isEnabled: true,
                allowedIps: [ '::/0' ]
            }
        }}));

        var agent = createAgent(app.callback());
        try {
            return await executeWithDriver({
                agent, apiKey, extraOptions: {
                    ...extraOptions,
                    mongodb: `${mongo.uri}${mongo.dbName}`
                },
                script,
            });
        }
        finally {
            agent.close();
        }
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
