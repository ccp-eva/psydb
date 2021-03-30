'use strict';
var expect = require('chai').expect,
    Mongod = require('mongodb-memory-server').MongoMemoryServer,
    MongoClient = require('mongodb').MongoClient,

    fetchRelatedRecordLabels = require('./fetch-related-record-labels');

var {
    ExactObject,
    ForeignId
} = require('@mpieva/psydb-schema-fields');

describe('fetchRecordById()', function () {
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

    it('works for noCustomTypes/noFixedTypes/single-channel', async () => {
        var collectionCreatorData = {
            hasCustomTypes: false,
            hasFixedTypes: false,
            hasSubChannels: false,

            // TODO: for non custom types this needs to be defined
            recordLabelDefinition: {
                format: '${0} (${1})',
                tokens: [
                    '/state/name',
                    '/state/owner'
                ],
            },

            State: () => ExactObject({
                properties: {
                    simpleId: ForeignId({
                        collection: 'subject',
                    }),
                    listOfIds: {
                        type: 'array',
                        default: [],
                        items: ForeignId({
                            collection: 'subject',
                        }),
                    }
                }
            })
        };

        await db.collection('subject').insertMany([
            {
                _id: 'barkbark',
                state: {
                    name: 'Bark Bark',
                    owner: 'Alice'
                },
            },
            {
                _id: 'meowmeow',
                state: {
                    name: 'Meow Meow',
                    owner: 'Bob',
                },
            },
            {
                _id: 'purrpurr',
                state: {
                    name: 'Purr Purr',
                    owner: 'Bob',
                },
            },
        ]);

        var relatedLabels = await fetchRelatedRecordLabels({
            db,
            sourceCollectionName: 'foo',
            collectionCreatorData,
            record: { state: {
                simpleId: 'barkbark',
                listOfIds: [
                    'meowmeow',
                    'purrpurr'
                ]
            }}
        });

    });
});

var initCollections = async(db) => {
    await db.collection('subject').insertMany([
        {
            _id: 'barkbark',
            type: 'dog',
            scientific: { state: {
                name: 'bark bark', bloodgroup: 'a',
            }},
            gdpr: { state: {
                ownerName: 'bar owner', address: 'bark street',
            }}
        },
        {
            _id: 'meowmeow',
            type: 'cat',
            scientific: { state: {
                name: 'meow meow', bloodgroup: 'b',
            }},
            gdpr: { state: {
                ownerName: 'meow', address: 'meow street',
            }}
        },
        {
            _id: 'purrpurr',
            type: 'cat',
            scientific: { state: {
                name: 'purr purr', bloodgroup: 'b',
            }},
            gdpr: { state: {
                ownerName: 'purr owner', address: 'purr street',
            }}
        },
    ]);
};
