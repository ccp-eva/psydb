'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    supertest = require('supertest'),
    Koa = require('koa'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoConnection = require('@mpieva/psydb-mongo-adapter').MongoConnection,

    withApi = require('./api');

describe('middleware/permissions', function () {
    this.timeout(0);
    
    var server, mongoUri, db;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri: mongoUri } = server.getInstanceInfo());
    });

    afterEach(async () => {
        var con = MongoConnection();
        con && con.close();
        await server.stop();
    });


    it('/init', async () => {
        var { app, agent } = createAppAndAgent(mongoUri);

        var { status, body } = await initApi(agent);
        expect(status).to.eql(200);
        
        var { status, body } = await initApi(agent);
        expect(status).to.eql(404);

    });

    it('/self', async () => {
        var { app, agent } = createAppAndAgent(mongoUri);
        await initApi(agent);
        
        var { status, body } = await agent.get('/self').send();
        expect(status).to.eql(401);

        await signIn(agent);
        
        var { status, body } = await agent.get('/self').send();
        expect(status).to.eql(200);

        console.log(body);

    })

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
