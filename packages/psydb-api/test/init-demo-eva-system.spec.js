'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    supertest = require('supertest'),
    Koa = require('koa'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    MongoConnection = require('@mpieva/psydb-mongo-adapter').MongoConnection,

    fixture = require('@mpieva/psydb-fixtures/json/demo-eva'),
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

        /*console.log('###########################################');
        var r = await db.collection('customRecordType').find({
            _id: context.TEACHER_TYPE_ID
        }, { projection: { events: false} }).toArray();
        //var r = await db.collection('subject').find().toArray();
        //console.dir(r.map(it => it), { depth: null });
        var r = await db.collection('study').find({}, { projection: { events: false }}).toArray();
        //console.dir(r.map(it => it), { depth: null });
        console.log('###########################################');*/

        //console.log(context);

        //var response = await agent.get(`/read/subject/teacher/${context.ALICE_TEACHER_ID}`);
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
        var response;
        //response = await agent.get('/metadata/record-schema/personnel');
        //response = await agent.get(`/read/study/default/${context.STUDY_01_ID}`);
        //response = await agent.get(`/read/location/instituteroom/${context.INSTITUTEROOM_01_ID}`);
        //response = await agent.get(`/read/subject/teacher/${context.ALICE_TEACHER_ID}`);
        //response = await agent.get(`/read/personnel/${context.EVE_RA_ID}`);
        //response = await agent.get(`/available-test-locations-for-study/${context.STUDY_01_ID}/${context.INSTITUTEROOM_TYPE_ID}`);
        //response = await agent.get(`/experiment-operator-teams-for-study/${context.STUDY_01_ID}`);
        //console.log('###############')
        //response = await agent.get(`/participated-subjects-for-study/${context.STUDY_01_ID}`);
        /*response = await agent.get(inline`
            /study-location-reservation-calendar
            /2021-01-01T00:00:00.000Z
            /2021-12-12T00:00:00.000Z
            /${context.STUDY_01_ID}
            /instituteroom
        `);*/
        /*response = await agent.post('/testable-subject-types-for-studies').send({
            studyIds: [ context.STUDY_01_ID ],
        });*/
        
        /*response = await agent.post('/selection-settings-for-subject-type-and-studies').send({
            subjectRecordType: 'child',
            studyIds: [ context.STUDY_02_ID ],
        });*/
        //response = await agent.get(`/read/subject/child/${context.ALICE_CHILD_ID}`);
        
        /*response = await agent.post('/testable-subjects-inhouse/').send({
            subjectRecordType: 'teacher',
            studyRecordType: 'default',
            studyIds: [ context.STUDY_01_ID ],
            timeFrameStart: '2021-05-01T00:00:00.000Z',
            timeFrameEnd: '2021-05-30T00:00:00.000Z',
            //timeFrameStart: '2079-04-01T00:00:00.000Z',
            //timeFrameEnd: '2081-04-15T00:00:00.000Z',
            enabledAgeFrames: [`/${context.STUDY_01_ID}/360_35640`],
            enabledValues: {
                [`/${context.STUDY_01_ID}/360_35640/conditions/biologicalGender`]: [ 'male' ],
                //[`/${context.STUDY_01_ID}/360_35640/conditions/schoolSubjects`]: []
            },
            offset: 0,
            limit: 100,
        });*/
        
        /*response = await agent.post(`/invite-confirmation-list`).send({
            researchGroupId: context.RESEARCH_GROUP_ALPHA_ID,
            subjectRecordType: 'teacher',
            start: '2000-01-01T00:00:00.000Z',
            end: '2025-01-01T00:00:00.000Z',
        });*/

        /*response = await agent.post(`/selectable-studies`).send({
            studyRecordType: 'default',
            experimentType: 'inhouse',
        });*/

        /*var response = await agent.post('/search').send({
            collectionName: 'helperSetItem',
            constraints: {
                '/setId': context.HS_LANG
            },
            filters: {},
            offset: 0,
            limit: 20,
        });*/

        //response = await agent.get(`/subject-type-data-for-study/${context.STUDY_01_ID}`);

        /*response = await agent.post('/search').send({
            collectionName: 'location',
            recordType: 'instituteroom',
            constraints: {},
            filters: {},
            offset: 0,
            limit: 20,
        });*/

        /*var response = await agent.post('/search').send({
            collectionName: 'personnel',
            constraints: {},
            filters: {},
            offset: 0,
            limit: 20,
        });*/

        /*response = await agent.post(`/experiment-calendar`).send({
            //researchGroupId: context.RESEARCH_GROUP_ALPHA_ID,
            subjectRecordType: 'child',
            experimentType: 'inhouse',
            interval: {
                start: '2000-01-01T00:00:00.000Z',
                end: '2025-01-01T00:00:00.000Z',
            },
        });*/

        /*response = await agent.post(`/selectable-studies-for-calendar`).send({
            subjectRecordType: 'child',
            experimentType: 'inhouse',
        });*/


        //response = await agent.get(`/read/experiment/${context.EXP_INHOUSE_02}`);
        //response = await agent.get(`/read/study/default/${context.STUDY_01_ID}`);

        response = await agent.get(`/extended-experiment-data/inhouse/${context.EXP_INHOUSE_01}`);

        /*response = await agent.post(`/experiment-postprocessing`).send({
            researchGroupId: context.RESEARCH_GROUP_ALPHA_ID,
            subjectRecordType: 'child',
        });*/

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

