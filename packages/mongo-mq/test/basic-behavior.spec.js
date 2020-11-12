'use strict';
var chai = require('chai');

chai.use(require('chai-datetime'));

var expect = chai.expect,
    MockDate = require('mockdate'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    omit = require('@cdxoo/omit'),

    MongoMQ = require('../src/');

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
        var mq = MongoMQ({
            db,
            createId: () => (20),
            ephemeralCollectionName: 'mqMessageQueue',
            persistCollectionName: 'mqMessageHistory',
        });

        var docs = undefined,
            correlationMessage = undefined,
            persistedMessage = undefined,
            now = new Date(),
            message = { type: 'foo-type', payload: { foo: 42 }};

        var expectedEphemeralDocs = [
            {
                _id: 20,
                timestamp: now,
                message: { ...message }
            }
        ];

        var expectedPersistedDocs = [
            {
                _id: 20,
                timestamp: now,
                message: {
                    ...omit('payload', message)
                }
            }
        ]

        MockDate.set(now);
        correlationMessage = await mq.add(message);
        MockDate.reset();
        expect(correlationMessage).to.eql(expectedEphemeralDocs[0]);
        docs = await db.collection('mqMessageQueue').find().toArray();
        expect(docs).to.eql(expectedEphemeralDocs);

        persistedMessage = await mq.persist(correlationMessage._id);
        expect(persistedMessage).to.eql(expectedPersistedDocs[0]);
        docs = await db.collection('mqMessageHistory').find().toArray();
        expect(docs).to.eql(expectedPersistedDocs);

        await mq.remove(correlationMessage._id);
        docs = await db.collection('mqMessageQueue').find().toArray();
        expect(docs).to.eql([]);

    });

});
