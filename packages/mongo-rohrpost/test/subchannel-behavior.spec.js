'use strict';
var chai = require('chai');

chai.use(require('chai-datetime'));

var expect = chai.expect,
    MockDate = require('mockdate'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    MongoRohrpost = require('../src/');

describe('subchannel-behavior', () => {

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


    it('handles multiple sub channels', async () => {
        var rohrpost = MongoRohrpost({
            db,
            correlationId: 1001,
            createChannelId: () => ( 20 ),
            createChannelEventId: () => ( 3333 ),
        });

        var docs = undefined,
            now = new Date();
        
        var scientificMessages = [
            { type: 'sci-foo-type', payload: { foo: 42 }},
            { type: 'sci-bar-type', payload: { bar: 43 }},
        ];

        var gdprMessages = [
            { type: 'gdpr-foo-type', payload: { foo: 42 }},
            { type: 'gdpr-bar-type', payload: { bar: 43 }},
        ];

        var Event = ({ message }) => ({
            _id: 3333,
            timestamp: now,
            correlationId: 1001,
            processed: false,
            message: { ...message }
        })

        var expectedDocs = [
            {
                _id: 20,
                gdpr: {
                    events: [
                        Event({ message: gdprMessages[0] }),
                    ],
                },
                sci: {
                    events: [
                        Event({ message: scientificMessages[0] }),
                    ],
                },
            }
        ];

        MockDate.set(now);
        var channel = rohrpost.openCollection('test').openChannel()
        
        await channel.dispatch({
            message: gdprMessages[0],
            subChannelKey: 'gdpr',
        });
        
        await channel.dispatch({
            message: scientificMessages[0],
            subChannelKey: 'sci',
        });

        MockDate.reset();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);

        expectedDocs[0].gdpr.events[0].processed = true;

        expectedDocs[0].sci.events[0].processed = true;
        
        await rohrpost.unlockModifiedChannels();
        docs = await db.collection('test').find().toArray();
        expect(docs).to.eql(expectedDocs);
        
    });

});
