'use strict';
var mongoHelpers = require('@cdxoo/mongo-test-helpers');
var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');

var Koa = require('koa');
var withApi = require('@mpieva/psydb-api');

var { ejson } = require('@mpieva/psydb-core-utils');
console.ejson = (that, options = {}) => {
    console.dir(ejson(that), { depth: null, ...options })
}

var beforeAll = async function () {
    this.context = { mongo: {}, app: undefined, server: undefined };
    
    await mongoHelpers.startup(this.context.mongo)();

    this.getDbHandle = () => {
        return this.context.mongo.dbHandle;
    }
    this.getServer = () => {
        return this.context.server;
    }

    this.defaultApiKey = [
        'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
        'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
    ].join('');

    this.getCommonVars = () => ({
        db: this.getDbHandle(),
        server: this.getServer(),
        apiKey: this.defaultApiKey,
    })
    
    this.restore = async (fixtureName) => {
        await mongoHelpers.clean(this.context.mongo)();

        var out = await restore.database({
            con: this.context.mongo.client,
            database: this.context.mongo.dbName,
            clean: true,
            from: fixtures.get(fixtureName, { db: true })
        })

        return out;
    };

    this.createServer = async (bag = {}) => {
        var { restore: fixtureName } = bag;
        if (fixtureName) {
            await this.restore(fixtureName);
        }

        var { mongo } = this.context;

        var app = new Koa();
        app.use(async (context, next) => {
            await next();
            context.mongoConnector.close();
        });
        app.use(withApi({ app, config: {
            db: {
                url: mongo.uri,
                dbName: mongo.dbName,
                useUnifiedTopology: true,
            },
            apiKeyAuth: {
                isEnabled: true,
                allowedIps: [ '::/0' ]
            },
            session: { key: 'koa:sess-test' },
            sessionSecret: 'SECRET|SECRET|SECRET|SECRET|SECRET|SECRET|SECRET',
            sessionSig: { keys: [ 'SUPER_SECRET' ] }
        }}));

        this.context.app = app;
        this.context.server = app.listen(0);

        return this.context.server;
    }

    this.fetchAllRecords = (collection) => (
        this.getDbHandle().collection(collection).find().toArray()
    )
}

var beforeEach = async function () {}
var afterEach = async function () {}

var afterAll = async function () {
    await mongoHelpers.teardown(this.context.mongo)();
    this.context.server?.close();
}

module.exports = {
    mochaHooks: {
        beforeAll: [ beforeAll ],
        beforeEach: [ beforeEach ],
        afterEach: [ afterEach ],
        afterAll: [ afterAll ]
    }
}
