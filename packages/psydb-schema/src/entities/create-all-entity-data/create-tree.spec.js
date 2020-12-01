'use strict';
var expect = require('chai').expect,
    createRecordTree = require('./create-record-tree');

describe('createRecordTree()', () => {
    it('creates the tree', () => {
        var records = [
            { entity: 'subject', type: 'animal', subtype: 'gorilla' },
            { entity: 'subject', type: 'animal', subtype: 'bonobo' },
            { entity: 'subject', type: 'human', subtype: 'child' },
            { entity: 'personnel', type: 'scientist' },
        ];
        var tree = createRecordTree({
            customSchemaCollectionRecords: records
        })
        console.log(tree);

        expect(tree).to.eql({
            subject: {
                key: 'subject',
                children: {
                    animal: {
                        key: 'animal',
                        children: {
                            gorilla: {
                                key: 'gorilla',
                                record: records[0],
                            },
                            bonobo: {
                                key: 'bonobo',
                                record: records[1],
                            }
                        }
                    },
                    human: {
                        key: 'human',
                        children: {
                            child: {
                                key: 'child',
                                record: records[2],
                            }
                        }
                    }
                }
            },
            personnel: {
                key: 'personnel',
                children: {
                    scientist: {
                        key: 'scientist',
                        record: records[3],
                    }
                }
            }
        })
    })
})
