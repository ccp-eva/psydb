'use strict';
var chai = require('chai');

chai.use(require('chai-datetime'));

var expect = chai.expect,
    MockDate = require('mockdate'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    MongoRohrpost = require('../src/');

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
        var rohrpost = MongoRohrpost({
            db,
            correlationId: 1001,
            createChannelId: () => ( 20 ),
            createChannelEventId: () => ( 3333 ),
        });

        var docs = undefined,
            now = new Date(),
            message = { type: 'foo-type', payload: { foo: 42 }};

        var expectedDocs = [
            {
                _id: 20,
                events: [
                    {
                        _id: 3333,
                        timestamp: now,
                        correlationId: 1001,
                        processed: false,
                        message: {
                            ...message
                        }
                    }
                ]
            }
        ];

        MockDate.set(now);
        await rohrpost.openCollection('test').openChannel().dispatch({
            message
        });
        MockDate.reset();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);

        expectedDocs[0].events[0].processed = true;

        await rohrpost.unlockModifiedChannels();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);
        
    });

    it('subChannelKey functionality', async () => {
        var rohrpost = MongoRohrpost({
            db,
            correlationId: 1001,
            createChannelId: () => ( 20 ),
            createChannelEventId: () => ( 3333 ),
        });

        var docs = undefined,
            now = new Date(),
            message = { type: 'foo-type', payload: { foo: 42 }};

        var expectedDocs = [
            {
                _id: 20,
                foo: {
                    events: [
                        {
                            _id: 3333,
                            timestamp: now,
                            correlationId: 1001,
                            processed: false,
                            message: {
                                ...message
                            }
                        }
                    ]
                }
            }
        ];

        MockDate.set(now);
        await rohrpost.openCollection('test').openChannel().dispatch({
            subChannelKey: 'foo',
            message
        });
        MockDate.reset();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);

        expectedDocs[0].foo.events[0].processed = true;

        await rohrpost.unlockModifiedChannels();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);
        
    });
});
