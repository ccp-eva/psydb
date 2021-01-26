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
            now = new Date();
        
        var messages = [
            { type: 'foo-type', payload: { foo: 42 }},
            { type: 'bar-type', payload: { bar: 43 }},
        ];

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
                            ...messages[1]
                        }
                    },
                    {
                        _id: 3333,
                        timestamp: now,
                        correlationId: 1001,
                        processed: false,
                        message: {
                            ...messages[0]
                        }
                    },
                ]
            }
        ];

        MockDate.set(now);
        var channel = rohrpost.openCollection('test').openChannel()
        
        var r = await channel.dispatch({
            message: messages[0],
        });
        console.dir(await db.collection('test').find().toArray(), { depth: null });
        var s = await channel.dispatch({
            message: messages[1],
            lastKnownMessageId: 3333,
        });

        //console.log(r);

        MockDate.reset();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);

        expectedDocs[0].events[0].processed = true;
        expectedDocs[0].events[1].processed = true;

        await rohrpost.unlockModifiedChannels();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);
        
    });

});
