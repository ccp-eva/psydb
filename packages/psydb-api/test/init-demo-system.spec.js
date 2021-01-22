'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    supertest = require('supertest'),
    Koa = require('koa'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    MongoConnection = require('@mpieva/psydb-mongo-adapter').MongoConnection,

    fixture = require('@mpieva/psydb-fixtures/json/demo'),
    withApi = require('../src/middleware/api');

describe('init-demo-system', function () {
    this.timeout(0);
    
    var server, mongoUri, testCon, db, app, agent;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri: mongoUri } = server.getInstanceInfo());
        
        ({ app, agent } = createAppAndAgent(mongoUri));
        
        testCon = await MongoClient.connect(
            mongoUri,
            { useUnifiedTopology: true }
        );
        
        db = testCon.db('testDB');
    });

    afterEach(async () => {
        testCon && testCon.close();

        var con = MongoConnection();
        con && con.close();
        await server.stop();
    });


    it('processes the messages', async () => {

        await initApi(agent);
        await signIn(agent);

        var context = {};
        var send = context.send = createSend(agent, context);
        for (var messageOrLambda of fixture.messages) {
            var status, body;
            if (typeof messageOrLambda === 'object') {
                ({ status, body } = await send(messageOrLambda));
            }
            else if (typeof messageOrLambda === 'function') {
                ({ status, body } = await messageOrLambda(context));
            }
            else {
                throw new Error(
                    'fixture definitions should be function or object'
                );
            }
            expect(status).to.eql(200);
            
            /*var r = await db.collection('helperSetItem').find().toArray();
            console.log('###########################################');
            console.log(r);
            console.log('###########################################');*/
        }

    });

});

var createAppAndAgent = (mongoUri) => {
    var app = new Koa();
    app.use(withApi(app, {
        db: {
            url: mongoUri,
            dbName: 'testDB',
            useUnifiedTopology: true,
        }
    }));
    
    var agent = supertest.agent(app.callback());

    return { app, agent };
}

var initApi = async (agent) => (
    await agent.post('/init').send()
);

var signIn = async (agent) => (
    await agent.post('/sign-in').send({
        email: 'root@example.com',
        password: 'test1234'
    })
);

///////////////////

var jsonpointer = require('jsonpointer');

var createSend = (agent, context) => async (message, onSuccess) => {
    console.log(message.type);
    var { status, body } = await agent.post('/').send(message);
    if (status === 200) {
        var modified = body.data;
        modified.forEach(it => {
            jsonpointer.set(
                context,
                `/knownMsgIds/${it.collectionName}/${it.channelId}`,
                it.lastKnownMessageId
            );
            jsonpointer.set(
                context,
                `/lastChannel/${it.collectionName}`,
                it.channelId
            );
        });
        if (onSuccess) {
            onSuccess(body, context);
        }
    }
    return { status, body }
};

