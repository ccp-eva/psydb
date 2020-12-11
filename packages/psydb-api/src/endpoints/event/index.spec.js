'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    { MongoClient, ObjectId } = require('mongodb'),
    nanoid = require('nanoid').nanoid,

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

    it('handle message', async () => {
        var context = createContext({
            type: 'records/create/personnel',
            payload: { id: 42, props: {
                gdpr: {
                    bar: 42,
                    baz: 43,
                },
                scientific: {
                    custom: {
                        a: 1,
                        b: 2
                    }
                }
            }}
        });
        await handleMessage({
            enableValidation: false,
            //disableAccessControl: true,
            //forcedPersonnelId: ObjectId('5fcf4481feb7ca0683978b80'),
            forcedPersonnelId: 'wcy-dSwU4O8WlBWzE_Zap',
        })(context, noop);
        
        var h = await db.collection('mqMessageHistory').find().toArray()
        console.dir(h, { depth: null });
        var records = await db.collection('personnel').find().toArray()
        console.dir(records, { depth: null });
    });

});

var noop = async () => {};
