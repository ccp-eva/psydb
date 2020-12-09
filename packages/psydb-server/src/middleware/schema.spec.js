'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    
    withAjv = require('./ajv'),
    withSchemas = require('./schema');

describe('middleware/schema', function () {
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
        
        //await initCollections(db);
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });

    it('adds schemas to context', async () => {
        var calledNext = false,
            next = async () => { calledNext = true; };

        var context = { db };
        await withAjv()(context, noop);
        await withSchemas()(context, next);
        
        console.dir(context.schemas);

        var schemas = context.schemas.findDefinitions({
            collection: 'personnel'
        });
        console.dir(schemas, { depth: null });

        var validators = context.schemas.findValidators({
            collection: 'personnel'
        });
        console.dir(validators, { depth: null });

        expect(calledNext).to.eql(true);
    });

});

var noop = async () => {};

var initCollections = async (db) => {
    await db.collection('customEntityType').insertMany([
        { state: {
            collection: 'external-person',
            type: 'doctor',
        }},
        { state: {
            collection: 'subject',
            type: 'dog',
            noConfirmationNeeded: true,
            customScientificSchema: {
                type: 'object',
                properties: {
                    foo: {
                        type: 'string',
                    }
                }
            },
        }}
    ])
}
