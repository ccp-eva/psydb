'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    supertest = require('supertest'),
    Koa = require('koa'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    MongoConnection = require('@mpieva/psydb-mongo-adapter').MongoConnection,

    fixture = require('@mpieva/psydb-fixtures/json/demo'),
    Driver = require('@mpieva/psydb-driver-nodejs'),
    withApi = require('../src/middleware/api');

var inline = require('@cdxoo/inline-string');

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
        var driver = Driver({ agent });
        await signIn(driver);

        var context = {};
        //var send = context.send = createSend(agent, context);
        
        context.driver = driver;
        context.lastEventId = driver.lastEventId;
        context.lastChannelId = driver.lastChannelId;
        
        var send = context.send = async (message, callback) => {
            console.log(message.type);
            var { status, body } = await driver.sendMessage(message);
            //console.log(status, body);
            if (callback) {
                callback(body, context);
            }
            return { status, body };
        };

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
        }

        console.log('###########################################');
        var r = await db.collection('customRecordType').find({
            _id: context.TEACHER_TYPE_ID
        }, { projection: { events: false} }).toArray();
        //var r = await db.collection('subject').find().toArray();
        //console.dir(r.map(it => it), { depth: null });
        var r = await db.collection('study').find({}, { projection: { events: false }}).toArray();
        //console.dir(r.map(it => it), { depth: null });
        console.log('###########################################');

        //console.log(context);

        var response = await agent.get(`/read/subject/teacher/${context.ALICE_TEACHER_ID}`);
        //console.dir(response.body, { depth: null });

        //var response = await agent.get(`/read/experiment/${context.EXP_INHOUSE_01}`);
        //console.dir(response.body, { depth: null });
        
        /*var response = await agent.post('/search-in-field').send({
            contextCollectionName: 'subject',
            contextRecordId: context.ALICE_TEACHER_ID,
            fieldPointer: '/scientific/state/systemPermissions/accessRightsByResearchGroup/researchGroupId',
            additionalFilter: {},
        });*/

        /*var response = await agent.post('/search-in-field').send({
            contextCollectionName: 'study',
            contextRecordId: context.STUDY_01_ID,
            fieldPointer: '/state/inhouseTestLocationSettings',
            additionalFilter: {},
        });*/

        // console.dir(response.body, { depth: null });
        /*var response = await agent.post('/search').send({
            collectionName: 'subject',
            recordType: 'teacher',
            filters: {
                '/gdpr/state/custom/firstname': 'Ali',
            },
            offset: 0,
            limit: 20,
        });*/
        /*var response = await agent.post('/search').send({
            collectionName: 'customRecordType',
            filters: {},
            offset: 0,
            limit: 20,
        });*/
        //var response = await agent.get('/metadata/schema/location/school');
        //response = await agent.get(`/read/study/default/${context.STUDY_01_ID}`);
        console.log('###############')
        //response = await agent.get(`/available-test-locations-for-study/${context.STUDY_01_ID}/${context.INSTITUTEROOM_TYPE_ID}`);
        //response = await agent.get(`/experiment-operator-teams-for-study/${context.STUDY_01_ID}`);
        response = await agent.get(inline`
            /study-location-reservation-calendar
            /2021-01-01T00:00:00.000Z
            /2021-12-12T00:00:00.000Z
            /${context.STUDY_01_ID}
            /instituteroom
        `);
        console.dir(response.status, { depth: null });
        console.dir(response.body, { depth: null });
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

/*var signIn = async (agent) => (
    await agent.post('/sign-in').send({
        email: 'root@example.com',
        password: 'test1234'
    })
);*/

var signIn = async (driver) => (
    await driver.signIn({
        email: 'root@example.com',
        password: 'test1234'
    })
);

///////////////////

var jsonpointer = require('jsonpointer');

var createSend = (agent, context) => async (message, onSuccess) => {
    //console.log(message.type);
    var { status, body } = await agent.post('/').send(message);
    //console.log(status, body);
    if (status === 200) {
        var modified = body.data;
        modified.forEach(it => {
            var path = (
                it.subChannelKey === undefined
                ? `/knownEventIds/${it.collectionName}/${it.channelId}`
                : `/knownEventIds/${it.collectionName}/${it.subChannelKey}/${it.channelId}`
            );
            jsonpointer.set(
                context,
                path,
                it.lastKnownEventId
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

