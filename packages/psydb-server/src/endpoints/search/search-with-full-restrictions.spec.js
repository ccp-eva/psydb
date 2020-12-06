'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    searchWithFullRestrictions = require('./search-with-full-restrictions');

describe('searchWithFullRestrictions()', function () {
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

    it('finds all allowed records of the type', async () => {
        
        console.log(new Date());
        var records = await searchWithFullRestrictions({
            db,
            collectionName: 'subject',
            allowedResearchGroupIds: ['bar-group'],
            searchableFields: [
                // FIXME: if we search fo ra field that
                // is not enabled here a full table scan ist
                // performed; thats bad probably we need to
                // inspect the query beforehand
                // and throw an error warning th user about accessing
                // trying to search or a field then
                // cant access
                'scientific.state.bloodgroup',
            ],
            readableFields: [
                'scientific.state.name',
                'scientific.state.bloodgroup',
            ],
            query: {
                'scientific.state.bloodgroup': 'a'
                //'gdpr.state.ownerName': 'purr owner'
            }
        });
        console.log(new Date());

        console.dir(records, { depth: null });

        /*expect(records).to.be.an('array').with.length(2);

        // all entries have _id field
        expect(
            records.filter(it => !!it._id)
        ).to.have.length(2);

        // all entries are as specified
        expect(
            records.map(({ _id, ...other }) => other)
        ).to.eql([
            { type: 'cat', scientific: { state: { name: 'meow meow' }}},
            { type: 'cat', scientific: { state: { name: 'purr purr' }}},
        ])*/
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

var initCollection = async (db) => {
    await db.collection('subject').createIndex({
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
    
    console.log(await db.collection('subject').indexInformation());

    await db.collection('subject').insertMany([
        {
            type: 'dog',
            scientific: { state: {
                name: 'bark bark', bloodgroup: 'a',
                ...SimplePermissions('bar-group')
            }},
            gdpr: { state: {
                ownerName: 'bar owner', address: 'bark street',
                ...SimplePermissions('foo-group')
            }}
        },
        {
            type: 'cat',
            scientific: { state: {
                name: 'meow meow', bloodgroup: 'b',
                ...SimplePermissions('foo-group', 'write'),
            }},
            gdpr: { state: {
                ownerName: 'meow', address: 'meow street',
                ...SimplePermissions('foo-group', 'read'),
            }}
        },
        {
            type: 'cat',
            scientific: { state: {
                name: 'purr purr', bloodgroup: 'b',
                ...SimplePermissions('foo-group', 'write'),
            }},
            gdpr: { state: {
                ownerName: 'purr owner', address: 'purr street',
                ...SimplePermissions('foo-group', 'read'),
            }}
        },
        ...range(50*1000).map(n => ({
            type: 'chimpanzee',
            scientific: { state: { 
                name: 'chimp chimp', bloodgroup: 'b',
                ...SimplePermissions('bar-group', 'write'),
            }},
        }))
    ])
};
