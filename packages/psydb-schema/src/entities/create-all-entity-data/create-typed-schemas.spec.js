'use strict';
var expect = require('chai').expect,
    createTypedSchemas = require('./create-typed-schemas');

describe('createTypedSchemas()', () => {
    it('creates the typed schemas', () => {
        var records = [
            { state: {
                entity: 'subject', type: 'animal', subtype: 'gorilla'
            }},
            { state: {
                entity: 'subject', type: 'animal', subtype: 'bonobo'
            }},
            { state: {
                entity: 'subject', type: 'human', subtype: 'child'
            }},
            { state: {
                entity: 'personnel', type: 'scientist'
            }},
        ];
        var instructions = {
            subject: {
                children: {
                    animal: {
                        default: ({ record }) => ({ animal: record }),
                    },
                    human: {
                        default: ({ record }) => ({ human: record }),
                    },
                }
            },
            personnel: {
                default: ({ record }) => ({ personnel: record }),
            }
        };

        var items = createTypedSchemas({
            records,
            instructions
        })
        
        console.log(items);

        expect(items).to.eql([
            { 
                entity: 'subject', type: 'animal', subtype: 'gorilla',
                schemas: { animal: records[0] },
            },
            { 
                entity: 'subject', type: 'animal', subtype: 'bonobo',
                schemas: { animal: records[1] },
            },
            {
                entity: 'subject', type: 'human', subtype: 'child',
                schemas: { human: records[2] },
            },
            {
                entity: 'personnel', type: 'scientist',
                schemas: { personnel: records[3] },
            },
        ])
    })
})
