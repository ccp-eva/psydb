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

var {
    compose, createId, Self, withRetracedErrors
} = require('@mpieva/psydb-api-lib');

var createAgent = require('@mpieva/psydb-axios-test-wrapper');
var Driver = require('@mpieva/psydb-driver-nodejs');
var withApi = require('../src/middleware/api');

var beforeAll = async function () {
    await createContext.call(this);

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
            sessionSecret: [
                '------------------------------------------',
                'DO NOT USE IN PRODUCTION GENERATE YOUR OWN',
                '------------------------------------------',
            ].join(''),
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
