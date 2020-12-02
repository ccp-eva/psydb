'use strict';
var expect = require('chai').expect,
    createTree = require('../../entities/create-all-entity-data/create-tree'),
    CombinedTypePermissions = require('./util/combined-type-permissions'),
    SubjectPermissions = require('./subject-permissions');

describe('SubjectPermissions()', () => {
    it('creates permission schema that includes all subtypes', () => {
        var typedSchemas = [
            {
                entity: 'subject',
                type: 'animal',
                subtype: 'dog',
                schemas: {
                    scientific: { state: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                        }
                    }}
                }
            },
            {
                entity: 'subject',
                type: 'human',
                subtype: 'child',
                schemas: {
                    scientific: { state: {
                        type: 'object',
                        properties: {
                            language: { type: 'string' }
                        }
                    }},
                    gdpr: { state: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' }
                        }
                    }}
                }
            }
        ];

        var schemaTree = createTree(typedSchemas);
    
        var permissions = SubjectPermissions({
            schemaTreeNodes: schemaTree.subject.children
        });

        //console.dir(permissions, { depth: null });

        expect(permissions.properties)
            .to.have.property('enableMinimalReadAccess');

        expect(permissions.required).to.eql([
            'enableMinimalReadAccess',
            'animal',
            'human'
        ]);

        expect(permissions.properties.animal).to.eql(
            CombinedTypePermissions({
                schemaTreeNodes: schemaTree.subject.children.animal.children
            }),
        );

        expect(permissions.properties.human).to.eql(
            CombinedTypePermissions({
                schemaTreeNodes: schemaTree.subject.children.human.children
            }),
        );

    });
});
