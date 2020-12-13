'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    withSelfAuth = require('./self-auth'),
    withPermissions = require('./permissions');

describe('middleware/permissions', function () {
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
        
        await initCollections(db);
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });

    it('throws when no session id', async () => {
        var error = undefined,
            context = { db, session: {}};
        try {
            await withSelfAuth()(context, noop);
            await withPermissions({ endpoint: '/search' })(context, noop);
        }
        catch (e) { error = e }

        expect(error).to.exist
    });

    it('sets up permissions when good', async () => {
        var calledNext = false,
            next = async () => { calledNext = true; };

        var context = { db, session: { personnelId: 'root-account' }};
        await withSelfAuth()(context, noop);
        await withPermissions({ endpoint: '/search' })(context, next);

        expect(context.permissions).to.include.keys([
            'hasRootAccess',
            'allowedResearchGroupIds',
            'canAccessEndpoint',
            'canUseMessageType',
        ]);

        expect(calledNext).to.eql(true);
    });

});

var noop = async () => {};

var initCollections = async (db) => {
    await db.collection('systemRole').insertMany([
        { _id: 'root-role', state: {
            hasRootAccess: true,
        }},
    ]);
    await db.collection('personnel').insertMany([
        { _id: 'root-account', scientific: { state: {
            systemRoleId: 'root-role',
            researchGroupIds: [],
        }}},
    ]);
}
