'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    BSON = require('bson'),
    uuid = require('uuid'),

    MongoMQ = require('./index');

describe('mongo-mq', () => {

    var server, uri, con;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri } = server.getInstanceInfo())
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });


    it('basic functions', async () => {
        con = await MongoClient.connect(
            uri,
            { useUnifiedTopology: true}
        );

        var mq = MongoMQ({
            collection: con.db('mydb').collection('mq'),
            generateId: () => (
                new BSON.Binary(
                    Buffer.from(uuid.parse(uuid.v4())),
                    BSON.Binary.SUBTYPE_UUID
                )
            )
        });

        var id = await mq.add({
            foo: 'foo'
        });

        var docs = await con.db('mydb').collection('mq').find().toArray();
        console.log(docs);
        console.log(BSON.EJSON.stringify(docs));

        await mq.remove(id);

        var docs = await con.db('mydb').collection('mq').find().toArray();
        console.log(docs);
        console.log(BSON.EJSON.stringify(docs));
    });

});
