'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    supertest = require('supertest'),
    Koa = require('koa'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoConnection = require('@mpieva/psydb-mongo-adapter').MongoConnection,

    fixture = require('@mpieva/psydb-fixtures/json/demo'),
    withApi = require('../src/middleware/api');

describe('init-demo-system', function () {
    this.timeout(0);
    
    var server, mongoUri, db, app, agent;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri: mongoUri } = server.getInstanceInfo());
        
        ({ app, agent } = createAppAndAgent(mongoUri));
    });

    afterEach(async () => {
        var con = MongoConnection();
        con && con.close();
        await server.stop();
    });


    it('processes the messages', async () => {

        await initApi(agent);
        await signIn(agent);

        for (var message of fixture.messages) {
            console.log(message);
            var { status, response } = await (
                agent.post('/').send(message)
            );
            expect(status).to.eql(200);
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
