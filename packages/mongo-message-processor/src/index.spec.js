'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    BSON = require('bson'),
    uuid = require('uuid'),

    Broker = require('./index');

describe('broker', () => {

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

        var queue = MongoMQ({
            collection: db.collection('mq'),
            createId: createMessageId,
        });

        var receiverCallback = async ({
            db,
            brokerKey: collectionName,
            channelId: documentId,
            correlationId,
            event
        }) => {
            await (
                db
                .collection(collectionName)
                .upsertOne({
                    _id: documentId,
                    // TODO: check if last element exists and
                    // if it does if processed: not false
                    // or it the same correlation id
                }, { $push: {
                    events: event,
                }})
            );
        };


        var studybroker = Broker({
            db: con.db('mydb'),
            key: 'study',
            recieverCallback,
        });
        var childbroker = Broker({
            db: con.db('mydb'),
            key: 'child',
            recieverCallback,
        });


        // dispatch an reciever callback
        var correlationMessage = await queue.add({ type: 'test-child' });

        var studychannel = studybroker.openChannel('12345');
        
        studychannel.dispatch({
            type: 'add-tested-child',
            payload: { childId: '44455' }
        }, correlationMessage._id);

        studies.get('1234').recalculateState();

        await childbroker.openChannel('44455').dispatch({
            correlationId: correlationMessage._id,
            type: 'add-participated-study',
            payload: { studyId: '12345' }
        });

        await history.add(correlationMessage);

        // last event - processed: false => processed: true
        studychannel.unlock();
        childchannel.unlock();

        queue.remove(correlationMessage_id);

        

        

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
