'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    
    withSchemas = require('./record-schemas');

describe('middleware/record-schemas', function () {
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
        //await withAjv()(context, noop);
        await withSchemas()(context, next);
        
        //console.dir(context.schemas);

        var schemas = context.recordSchemas.find({
            collection: 'personnel'
        });
        console.dir(schemas, { depth: null });

        /*var data = {
            name: { firstname: 'bob', lastname: 'bauer' },
            shorthand: '  BB  ',
            emails: [
                { email: 'bob@example.com', isPrimary: true },
            ],
            phones: [
                { number: '0341/123123', type: 'mobile' }
            ],
            //systemPermissions: {},
            //internals: {},
            myAdditional: 'foo',
        };
        var isValid = validators.gdpr(data);
        console.log(isValid);
        console.log(validators.gdpr.errors);
        console.log(data);*/

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
