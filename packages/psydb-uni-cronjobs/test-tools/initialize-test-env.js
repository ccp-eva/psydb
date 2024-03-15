'use strict';
var {
    mochaHooks
} = require('@mpieva/psydb-api-mocha-test-tools/initialize-test-env');

var [ createContext ] = mochaHooks.beforeAll;
var [ teardownDB ] = mochaHooks.afterAll;

var Koa = require('koa');

var {
    hasNone, hasOnlyOne, flatten, entries
} = require('@mpieva/psydb-core-utils');

var createAgent = require('@mpieva/psydb-axios-test-wrapper');
var Driver = require('@mpieva/psydb-driver-nodejs');
var withApi = require('@mpieva/psydb-api');

var defaultCLIOptions = require('./default-cli-options');
var setupInbox = require('./setup-inbox');

var beforeAll = async function () {
    await createContext.call(this);

    this.setupInbox = setupInbox;

    this.getDefaultCLIOptions = ({ agent, psydbUrl } = {}) => ({
        ...defaultCLIOptions,
        psydbUrl: (
            psydbUrl
            || agent?.defaults?.baseURL
            || this.getApiAgent()?.defaults?.baseURL
        )
    });

    this.createKoaApi = (options = {}) => {
        var { apiConfig } = options;
        this.context.api = {};

        var mongo = this.getMongoContext();

        var app = new Koa();
        app.use(async (context, next) => {
            await next();
            context.mongoConnector.close();
        });
        app.use(withApi({ app, config: {
            ...apiConfig,
            db: {
                url: mongo.uri,
                dbName: mongo.dbName,
                useUnifiedTopology: true,
            },
            apiKeyAuth: { isEnabled: true, allowedIps: [ '::/0' ] }
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
            hasFinishedTwoFactorAuth: finished2FA
        }
    }
    
    ////////////////////////////////
    // FIXME: redundandt see message handlers
    this.getRecord = async (collection, filters, { subChannels = false } = {}) => {
        if (['subject', 'personnel'].includes(collection)) {
            subChannels = true;
        }

        var { _id, type, ...otherFilters } = filters;
        var db = this.getDbHandle();
       
        // XXX: bug in flattened when empty object passed
        var flattened = (
            !hasNone(Object.keys(otherFilters))
            ? flatten(otherFilters)
            : {}
        );
        var AND = [];
        for (var [key, value] of entries(flattened)) {
            if (subChannels) {
                AND.push({ $or: [
                    { [`gdpr.state.${key}`]: value },
                    { [`gdpr.state.custom.${key}`]: value },
                    { [`scientific.state.${key}`]: value },
                    { [`scientific.state.custom.${key}`]: value },
                ]})
            }
            else {
                AND.push({ $or: [
                    { [`state.${key}`]: value },
                    { [`state.custom.${key}`]: value },
                ]})
            }
        }
       
        var mongoFilter = {
            ...(_id && { _id }),
            ...(type && { type }),
            ...(!hasNone(AND) && {
                $and: AND
            })
        };

        var records = await db.collection(collection).find({
            ...mongoFilter
        }).toArray();

        if (hasNone(records)) {
            console.dir(ejson(mongoFilter), { depth: null })
            throw new Error('no record found');
        }
        if (!hasOnlyOne(records)) {
            console.dir(ejson(mongoFilter), { depth: null })
            throw new Error('multiple records found');
        }

        return records[0];
    }

    this.getId = async (...args) => {
        var record = await this.getRecord(...args);
        return record._id;
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
