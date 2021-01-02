'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    
    initEndpoint = require('./index');

describe('init-endpoint', function () {
    this.timeout(0);
    
    var server, uri, con, db;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri } = server.getInstanceInfo());

        con = await MongoClient.connect(
            uri,
            { useUnifiedTopology: true }
        );

        db = con.db('testDB');
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });

    it('initializes db with minimal data', async () => {
        var calledNext = false,
            next = async () => { calledNext = true; };

        var config = {
            init: {
                rootAccountEmail: 'root@example.com',
                rootAccountPassword: 'test1234',
            }
        }

        var context = { db };

        await initEndpoint(context, next);

        var personnel = await db.collection('personnel').find().toArray();
        console.dir(personnel, { depth: null });

        var roles = await db.collection('systemRole').find().toArray();
        console.dir(roles, { depth: null });

        expect(calledNext).to.eql(true);
    });

});

var noop = async () => {};
