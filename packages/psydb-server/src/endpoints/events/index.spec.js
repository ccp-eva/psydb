'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    handleMessage = require('./index');

describe('handleMessage()', function () {
    this.timeout(0);

    var server, uri, con, db, createContext;
    beforeEach(async () => {
        server = new Mongod();
        await server.start();
        ({ uri } = server.getInstanceInfo());

        con = await MongoClient.connect(
            uri,
            { useUnifiedTopology: true }
        );

        db = con.db('testDB');
        
        createContext = (body) => ({
            db,
            session: {},
            request: { body }
        });
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });

    it('finds all allowed records of the type', async () => {
        var context = createContext({
            type: 'foo',
            payload: { foo: 42 }
        });
        await handleMessage(context, noop);
    });

});

var noop = async () => {};
