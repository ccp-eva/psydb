'use strict';
var expect = require('chai').expect,
    createTree = require('./create-tree');

describe('createRecordTree()', () => {
    it('creates the tree', () => {
        var typedSchemas = [
            { 
                entity: 'subject', type: 'animal', subtype: 'gorilla',
                schemas: 'gorilla-schemas',
            },
            {
                entity: 'subject', type: 'animal', subtype: 'bonobo',
                schemas: 'bonobo-schemas',
            },
            {
                entity: 'subject', type: 'human', subtype: 'child',
                schemas: 'child-schemas',
            },
            {
                entity: 'personnel', type: 'scientist',
                schemas: 'scientist-schemas',
            },
        ];

        var tree = createTree(typedSchemas)
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
                                schemas: 'gorilla-schemas',
                            },
                            bonobo: {
                                key: 'bonobo',
                                schemas: 'bonobo-schemas',
                            }
                        }
                    },
                    human: {
                        key: 'human',
                        children: {
                            child: {
                                key: 'child',
                                schemas: 'child-schemas',
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
                        schemas: 'scientist-schemas',
                    }
                }
            }
        })
    })
})
