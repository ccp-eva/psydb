'use strict';
require('debug').enable('*');

var expect = require('chai').expect,
    request = require('supertest'),
    Koa = require('koa'),
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoConnection = require('@mpieva/psydb-mongo-adapter').MongoConnection,

    withApi = require('./api');

describe('middleware/permissions', function () {
    this.timeout(0);
    
    var server, uri, db;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri } = server.getInstanceInfo());
    });

    afterEach(async () => {
        var con = MongoConnection();
        con && con.close();
        await server.stop();
    });


    it('/init', async () => {
        var app = new Koa();
        app.use(withApi(app, {
            db: {
                url: uri,
                dbName: 'testDB',
                useUnifiedTopology: true,
            }
        }));

        var response = await (
            request(app.callback())
            .get('/self')
            .send()
        );
        
        console.log(response.status, response.body);
    });

});
