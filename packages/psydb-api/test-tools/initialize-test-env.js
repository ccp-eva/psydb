'use strict';
var {
    mochaHooks
} = require('@mpieva/psydb-api-mocha-test-tools/initialize-test-env');

var [ createContext ] = mochaHooks.beforeAll;
var [ teardownDB ] = mochaHooks.afterAll;

var Koa = require('koa');

var createAgent = require('@mpieva/psydb-axios-test-wrapper');
var Driver = require('@mpieva/psydb-driver-nodejs');
var withApi = require('../src/middleware/api');

var beforeAll = async function () {
    await createContext.call(this);

    this.createKoaApi = (options = {}) => {
        var { apiConfig } = options;
        this.context.api = {};

        var app = new Koa();
        app.use(async (context, next) => {
            await next();
            context.mongoConnector.close();
        });
        app.use(withApi({ app, config: {
            ...apiConfig,
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

    this.createFakeSession = async (bag) => {
        var { email, finished2FA = false } = bag;
        var db = this.getDbHandle();

        var { _id: personnelId } = await (
            db.collection('personnel').findOne({
                'gdpr.state.emails.email': email
            })
        );

        return {
            personnelId,
            hasFinishedTwoFactorAuthentication: finished2FA
        }
    }
}

var afterAll = async function () {
    this.context.api?.agent?.close();
    await teardownDB.call(this);
}

module.exports = {
    mochaHooks: {
        ...mochaHooks,
        beforeAll: [ beforeAll ],
        afterAll: [ afterAll ]
    }
}
