'use strict';
var chai = require('chai');

chai.use(require('chai-datetime'));

var expect = chai.expect,
    MockDate = require('mockdate'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    compose = require('koa-compose'),
    omit = require('@cdxoo/omit'),

    createMongoRohrpostMiddleware = require('../src/');

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
            correlationId = 1001,
            message = { type: 'foo-type', payload: { foo: 42 }};

        var expectedDocs = [
            {
                _id: 20,
                events: [
                    {
                        _id: 3333,
                        timestamp: now,
                        correlationId: correlationId,
                        processed: false,
                        message: {
                            ...message
                        }
                    }
                ]
            }
        ];

        var withRohrpost = createMongoRohrpostMiddleware({
            createChannelId: () => (20),
            createChannelEventId: () => (3333),
        });

        var performInnerChecks = async (context, next) => {
            var { rohrpost, mexxage } = context;
            expect(rohrpost).to.exist;

            await rohrpost.openCollection('test').openChannel().dispatch(
                message
            );

            var docs = await db.collection('test').find().toArray();
            expect(docs).to.eql(expectedDocs);
        }


        var doStuff = compose([
            withRohrpost,
            performInnerChecks,
        ]);

        MockDate.set(now);
        await doStuff({ db, correlationId, message }, noop);
        MockDate.reset();

        expectedDocs[0].events[0].processed = true;
        var docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);
    });

});
