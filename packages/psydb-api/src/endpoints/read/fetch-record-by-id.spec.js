'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    fetchRecordById = require('./fetch-record-by-id');

describe('read()', function () {
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
        
        await initCollection(db);
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });

    it('root read always works', async () => {
        var args = {
            db,
            permissions: {
                hasRootAccess: true,
            },
            hasSubChannels: true,
            collectionName: 'subject',
            id: undefined,
        };
        var record = undefined;

        args.id = 'barkbark';
        record = await fetchRecordById(args);
        console.dir(record, { depth: null });

        args.id = 'meowmeow';
        record = await fetchRecordById(args);
        console.dir(record, { depth: null });
        
        args.id = 'purrpurr';
        record = await fetchRecordById(args);
        console.dir(record, { depth: null });

    });

    it('read with foo group works correctly', async () => {
        var args = {
            db,
            permissions: {
                hasRootAccess: false,
                canReadCollection: (name) => (true),
                allowedResearchGroupIds: [ 'foo-group' ]
            },
            hasSubChannels: true,
            collectionName: 'subject',
            id: undefined,
        };
        var record = undefined;

        args.id = 'barkbark';
        record = await fetchRecordById(args);
        console.dir(record, { depth: null });

        args.id = 'meowmeow';
        record = await fetchRecordById(args);
        console.dir(record, { depth: null });
        
        args.id = 'purrpurr';
        record = await fetchRecordById(args);
        console.dir(record, { depth: null });

    });

});

var range = (n) => ([ ...Array(n).keys() ]);

var SimplePermissions = (group, perm) => ({
    systemPermissions: {
        accessRightsByResearchGroup: [
            { researchGroupId: group, permission: perm || 'read' }
            //group
        ]
    },
})

var Permissions = (groups, perm) => ({
    systemPermissions: {
        accessRightsByResearchGroup: groups.map(g => ({
            researchGroupId: g, permission: perm || 'read'
        }))
    },
})

var initCollection = async (db) => {
    /*await db.collection('subject').createIndex({
        'type': 1,
    });
    await db.collection('subject').createIndex({
        'scientific.state.bloodgroup': 1,
    });
    await db.collection('subject').createIndex({
        'scientific.state.systemPermissions.accessRightsByResearchGroup': 1,
    }, { name: 'sci.sysPerm.access' });
    await db.collection('subject').createIndex({
        'scientific.state.systemPermissions.accessRightsByResearchGroup.researchGroupId': 1,
    }, { name: 'sci.sysPerm.access.id' });
    await db.collection('subject').createIndex({
        'scientific.state.systemPermissions.accessRightsByResearchGroup.permission': 1,
    }, { name: 'sci.sysPerm.access.perm' });
    
    console.log(await db.collection('subject').indexInformation());*/

    await db.collection('subject').insertMany([
        {
            _id: 'barkbark',
            type: 'dog',
            scientific: { state: {
                name: 'bark bark', bloodgroup: 'a',
                ...Permissions([ 'bar-group' ])
            }},
            gdpr: { state: {
                ownerName: 'bar owner', address: 'bark street',
                //...SimplePermissions('foo-group')
            }}
        },
        {
            _id: 'meowmeow',
            type: 'cat',
            scientific: { state: {
                name: 'meow meow', bloodgroup: 'b',
                ...Permissions([ 'foo-group' ]),
            }},
            gdpr: { state: {
                ownerName: 'meow', address: 'meow street',
                //...SimplePermissions('foo-group', 'read'),
            }}
        },
        {
            _id: 'purrpurr',
            type: 'cat',
            scientific: { state: {
                name: 'purr purr', bloodgroup: 'b',
                ...Permissions(['foo-group', 'bar-group']),
            }},
            gdpr: { state: {
                ownerName: 'purr owner', address: 'purr street',
                //...SimplePermissions('foo-group', 'read'),
            }}
        },
        /*...range(50*1000).map(n => ({
            type: 'chimpanzee',
            scientific: { state: { 
                name: 'chimp chimp', bloodgroup: 'b',
                ...SimplePermissions('bar-group', 'write'),
            }},
        }))*/
    ])
};
