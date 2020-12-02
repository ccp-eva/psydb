'use strict';
var expect = require('chai').expect,
    createTree = require('../../entities/create-all-entity-data/create-tree'),
    SubjectPermissions = require('./subject-permissions'),
    LocationPermissions = require('./location-permissions'),
    PersonnelPermissions = require('./personnel-permissions'),
    AllCollectionPermissions = require('./all-collection-permissions');

describe('AllCollectionPermissions()', () => {
    it('creates permission schema for all entities', () => {
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
                entity: 'location',
                type: 'building',
                subtype: 'kindergarden',
                schemas: {
                    state: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                        }
                    }
                }
            },
        ];

        var schemaTree = createTree(typedSchemas);
        schemaTree = {
            ...schemaTree,
            personnel: {
                schemas: {
                    state: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                        }
                    }
                }
            }
        }
        //console.dir(schemaTree, { depth: null });
    
        var permissions = AllCollectionPermissions({
            schemaTree,
        });

        //console.dir(permissions, { depth: null });

        expect(permissions.required).to.eql([
            'subject',
            'location',
            'personnel'
        ]);

        expect(permissions.properties.subject).to.eql(
            SubjectPermissions({
                schemaTreeNodes: schemaTree.subject.children
            }),
        );

        expect(permissions.properties.location).to.eql(
            LocationPermissions({
                schemaTreeNodes: schemaTree.location.children
            }),
        );

        expect(permissions.properties.personnel).to.eql(
            PersonnelPermissions({
                stateSchema: schemaTree.personnel.schemas.state
            }),
        );

    });
});
