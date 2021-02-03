'use strict';
var chai = require('chai');

chai.use(require('chai-datetime'));

var expect = chai.expect,
    MockDate = require('mockdate'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    MongoRohrpost = require('../src/');

var {
    ChannelCreationFailed,
    ChannelUpdateFailed,
} = MongoRohrpost.Errors;

var dummyMessage = {
    type: 'dummy-type', payload: { foo: 42 }
};


describe('throw-behavior', () => {

    var server, uri, con, db, rohrpost, channel, channelIdCounter, channelEventIdCounter;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri } = server.getInstanceInfo());

        con = await MongoClient.connect(
            uri,
            { useUnifiedTopology: true}
        );

        db = con.db('testDB');
        
        channelIdCounter = 0;
        channelEventIdCounter = 0;
        rohrpost = MongoRohrpost({
            db,
            correlationId: 1001,
            createChannelId: () => ( channelIdCounter += 1 ),
            createChannelEventId: () => ( channelEventIdCounter += 1 ),
        });

    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });


    it('update throws when channel with id not exist', async () => {
        var channel = rohrpost.openCollection('test').openChannel({
            id: 1000
        });

        var error = undefined;
        try {
            await channel.dispatch({ message: dummyMessage });
        }
        catch (e) {
            error = e;
        }
        expect(error).to.be.an.instanceOf(ChannelUpdateFailed)
    });

    it('update throws when last message id is undefined', async () => {
        var channel = rohrpost.openCollection('test').openChannel()
        await channel.dispatch({ message: dummyMessage });
        
        var error = undefined;
        try {
            await channel.dispatch({
                message: dummyMessage,
                lastKnownEventId: undefined
            });
        }
        catch (e) {
            error = e;
        }
        expect(error).to.be.an.instanceOf(ChannelUpdateFailed)

    });

    it('update throws when last message id does not match', async () => {
        var channel = rohrpost.openCollection('test').openChannel()
        await channel.dispatch({ message: dummyMessage });
    
        var error = undefined;
        try {
            await channel.dispatch({
                message: dummyMessage,
                lastKnownEventId: 'invalid-id'
            });
        }
        catch (e) {
            error = e;
        }
        expect(error).to.be.an.instanceOf(ChannelUpdateFailed)

    });
});
