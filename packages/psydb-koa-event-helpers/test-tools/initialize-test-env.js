'use strict';
require('@mpieva/psydb-api-mocha-test-tools/mocha-async-step');
var { mochaHooks, ...other }
    = require('@mpieva/psydb-api-mocha-test-tools/initialize-test-env');

var MongoRohrpost = require('@cdxoo/mongo-rohrpost');
var { ObjectId, aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var augmentedBeforeAll = async function () {
    await mochaHooks.beforeAll[0].call(this);

    this.getDbClient = () => this.context.mongodb.client;
    this.getDbName = () => this.context.mongodb.dbName;

    this.createRohrpost = (bag = {}) => {
        var { correlationId = 'corr_1010101' } = bag;
        var { client, dbName } = this.getMongoContext();
        
        var rohrpost = MongoRohrpost({
            client, dbName, correlationId,
            
            createChannelId: () => ObjectId(),
            createChannelEventId: () => ObjectId(),
            enableTransactions: false,
            enableOptimisticLocking: false,
        
            // force auto unlock disabled as we do it manually
            disableChannelAutoUnlocking: true,
        });

        return rohrpost;
    }

    this.createSelf = (bag = {}) => {
        var {
            personnelId = 'staff_1010101',
            apiKey = undefined, // 'apikey_1010101'
        } = bag;

        return { personnelId, apiKey }
    }

    this.createEngineContext = (bag = {}) => {
        var {
            rohrpost = this.createRohrpost(),
            self = this.createSelf(),
            now = new Date()
        } = bag;

        var context = {
            db: this.getDbHandle(),
            rohrpost, self, now
        }

        return context;
    }

    this.aggregateAll = async (collections) => {
        var db = this.getDbHandle();

        var out = {}
        for (var c of collections) {
            out[c] = await aggregateToArray({ db, [c]: [] })
        }
        return out;
    }
}

module.exports = {
    mochaHooks: {
        ...mochaHooks,
        beforeAll: [ augmentedBeforeAll ],
    }
}
