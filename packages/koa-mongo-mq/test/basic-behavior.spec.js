'use strict';
var chai = require('chai');

chai.use(require('chai-datetime'));

var expect = chai.expect,
    MockDate = require('mockdate'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    compose = require('koa-compose'),
    omit = require('@cdxoo/omit'),

    createMongoMQMiddleware = require('../src/');

// no operation
var noop = async () => {};

describe('basic-behavior', () => {

    var server, uri, con, db;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri } = server.getInstanceInfo());

        con = await MongoClient.connect(
            uri,
            { useUnifiedTopology: true}
        );

        db = con.db('testDB');
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });


    it('core functionality', async () => {
        var now = new Date(),
            message = { type: 'foo-type', payload: { foo: 42 }};

        var expectedQueue = [
            {
                _id: 20,
                timestamp: now,
                message: { ...message }
            }
        ];

        var expectedHistory = [
            {
                _id: 20,
                timestamp: now,
                message: {
                    ...omit('payload', message)
                }
            }
        ]

        var withMongoMQ = createMongoMQMiddleware({
            createId: () => (20),
            ephemeralCollectionName: 'mqMessageQueue',
            persistCollectionName: 'mqMessageHistory',
        });

        var performInnerChecks = async (context, next) => {
            expect(context.correlationId).to.equal(20);

            var queue = await (
                db.collection('mqMessageQueue').find().toArray()
            );
            expect(queue).to.eql(expectedQueue);
            
            var history = await (
                db.collection('mqMessageHistory').find().toArray()
            );
            expect(history).to.eql([]);
        }


        var doStuff = compose([
            withMongoMQ,
            performInnerChecks,
        ]);

        MockDate.set(now);
        await doStuff({ db, message }, noop);
        MockDate.reset();

        var queue = await (
            db.collection('mqMessageQueue').find().toArray()
        );
        expect(queue).to.eql([]);
            
        var history = await (
            db.collection('mqMessageHistory').find().toArray()
        );
        expect(history).to.eql(expectedHistory);
    });

});
