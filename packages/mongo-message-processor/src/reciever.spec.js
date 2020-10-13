'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient;

describe('reciever', () => {

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


    it('upsert test', async () => {
        con = await MongoClient.connect(
            uri,
            { useUnifiedTopology: true}
        );

        var db = con.db('mydb');

        db.collection('study').deleteMany({});

        db.collection('study').insertOne({
            _id: 1,
            events: [{ correlationId: 12, processed: false  }]
        })

        // FIXME: upsert in this case will throw duplicate key when 
        // the $or stuff isnt matched, so thats not what we expected
        // but actzually doesnt for what we try to achieve
        var status = await (
            db
            .collection('study')
            .updateOne(
                {
                    _id: 1,
                    $or: [
                        { 'events.0.correlationId': 55 },
                        { 'events.0.processed': true }
                    ]
                    // FIXME: doesnt work with upsert: true
                    // also its not supported before mongodb 3.6
                    /*$or: [
                        { $expr: { $eq: [
                            { "$arrayElemAt": [
                                "$events.processed", -1
                            ]},
                            false,
                        ]}},
                        { $expr: { $eq: [
                            { "$arrayElemAt": [
                                "$events.correlationId", -1
                            ]},
                            55,
                        ]}},
                    ]*/
                    // TODO: check if last element exists and
                    // if it does if processed: not false
                    // or it the same correlation id
                },
                // FIXME: as expr doesnt work with upsert we cant use push
                /*{ $push: {
                    events: { correlationId: 55, processed: false },
                }}*/
                { $push: {
                    events: {
                        $each: [{ correlationId: 55, processed: false }],
                        $position: 0,
                    },
                }},
                { upsert: true }
            )
        );
        console.log(status.result);

        var docs = await con.db('mydb').collection('study').find().toArray();
        console.log(docs);
        console.log(docs[0].events);
    });

});
