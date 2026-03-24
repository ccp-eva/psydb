'use strict';
var { mochaHooks, ...other }
    = require('@mpieva/psydb-api-mocha-test-tools/initialize-test-env');

var mongoHelpers = require('@cdxoo/mongo-test-helpers');

var {
    merge, entries, pathify, flatten, ejson,
    hasNone, hasOnlyOne, jsonify,
} = require('@mpieva/psydb-core-utils');

var fixtures = require('@mpieva/psydb-fixtures');
var { Permissions } = require('@mpieva/psydb-common-lib');
var {
    compose, createId, Self, withRetracedErrors
} = require('@mpieva/psydb-api-lib');

require('@mpieva/psydb-api-mocha-test-tools/mocha-async-step');

console.ejson = (that) => console.dir(ejson(that), { depth: null });

var {
    withEventEngine,
    // FIXME: theese will be moved inside handlers themselves
    // as they are distinct from the actual event engine
    withDefaultContextSetup,
    withDefaultResponseBody,
} = require('@mpieva/psydb-koa-event-middleware');

var augmentedBeforeAll = async function () {
    await mochaHooks.beforeAll[0].call(this);

    this.createEngine = (options) => {
        var { RootHandler } = options;

        var engine = withEventEngine({
            availableMessageHandlers: RootHandler,
            //develop_forceAwaitRemoteEffects: true
        });

        return engine;
    }

    this.createKoaContext = (message, extraContext = {}) => {
        var koaContext = {
            mongoClient: this.context.mongo.client,
            mongoDbName: this.context.mongo.dbName,
            db: this.context.mongo.dbHandle,

            session: { personnelId: 1234 },
            self: { personnelId: 1234 },
            request: { body: message },
            response: {},
            ip: '127.0.0.1'
        }
        return { ...koaContext, ...extraContext };
    }

    this.createFakeLogin = async (bag) => {
        var { email } = bag;

        var db = this.getDbHandle();
        var self = await Self({ db, query: {
            'gdpr.state.emails.email': email
        }});
        
        var permissions = Permissions.fromSelf({ self });

        return {
            session: { personnelId: self.record._id },
            self,
            permissions,
        }
    }

    this.createMessenger = (options) => {
        var { RootHandler, login, ...extraOptionsContext } = options;

        if (!RootHandler) {
            RootHandler = require('../src');
        }

        var didAutoLogin = false;
        var send = async (message, extraContext) => {
            if (login && !didAutoLogin) {
                extraOptionsContext = {
                    ...extraOptionsContext,
                    ...(await this.createFakeLogin({ ...login }))
                }
                didAutoLogin = true;
            }

            var koaContext = this.createKoaContext(
                jsonify(message), { ...extraOptionsContext, ...extraContext }
            );
            var next = async () => {}

            await compose([
                withDefaultContextSetup(),
                this.createEngine({ RootHandler }),
                withDefaultResponseBody,
            ])(koaContext, next);

            return koaContext;
        }

        return [ send ];
    }

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
    
    this.fetchAllRecords = (collection) => {
        var db = this.getDbHandle();
        return db.collection(collection).find().toArray();
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

module.exports = {
    mochaHooks: {
        ...mochaHooks,
        beforeAll: [ augmentedBeforeAll ],
    }
}
