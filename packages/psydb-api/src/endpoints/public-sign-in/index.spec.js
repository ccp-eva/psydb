'use strict';
require('debug').enable('psydb:*');

var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,
    bcrypt = require('bcrypt'),

    signIn = require('./index');

describe('signIn()', function () {
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
        
        await initCollections(db);
        
        createContext = ({ email, password }) => ({
            db,
            session: {},
            request: { body: {
                email,
                password
            }}
        });
    });

    afterEach(async () => {
        if (con) {
            con.close();
        }
        await server.stop();
    });

    // TODO: 401 failure cases

    it('handles root role login', async () => {
        var calledNext = false,
            next = async () => { calledNext = true; };

        var context = createContext({
            email: 'alice@example.com',
            password: 'alice-rocks'
        });

        await signIn(context, next);

        expect(context.session.personnelId).to.eql('alice');
        expect(calledNext).to.eql(true);
    });

    it('handles other role login', async () => {
        var calledNext = false,
            next = async () => { calledNext = true; };

        var context = createContext({
            email: 'bob@example.com',
            password: 'bob-rocks'
        });

        await signIn(context, next);

        expect(context.session.personnelId).to.eql('bob');
        expect(calledNext).to.eql(true);
    });



});

var initCollections = async (db) => {
    await db.collection('systemRole').insertMany([
        createSystemRoleRecord({
            _id: 'root', hasRootAccess: true,
        }),
        createSystemRoleRecord({
            _id: 'scientist', hasRootAccess: false,
        }),
    ]);
    await db.collection('personnel').insertMany([
        createPersonnelRecord({
            _id: 'alice',
            email: 'alice@example.com',
            password: 'alice-rocks',
            systemRoleId: 'root',
            researchGroupIds: [],
        }),
        createPersonnelRecord({
            _id: 'bob',
            email: 'bob@example.com',
            password: 'bob-rocks',
            systemRoleId: 'scientist',
            researchGroupIds: [ 'child-studies' ],
        }),
    ]);
}

var createSystemRoleRecord = ({
    _id,
    hasRootAccess,
}) => ({
    _id,
    state: {
        hasRootAccess,
    }
})

var createPersonnelRecord = ({
    _id,
    email,
    password,
    systemRoleId,
    researchGroupIds
}) => ({
    _id,
    scientific: {
        state: {
            systemRoleId,
            researchGroupIds: researchGroupIds || [],
        }
    },
    gdpr: {
        state: {
            emails: [
                { email, isPrimary: true }
            ],
            internals: {
                passwordHash: bcrypt.hashSync(password, 10)
            }
        }
    }
});
