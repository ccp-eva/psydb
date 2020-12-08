'use strict';
var expect = require('chai').expect,
    createTree = require('../../entities/create-all-entity-data/create-tree'),
    Custom = require('./util/custom-collection-permissions'),
    Fixed = require('./util/fixed-collection-permissions'),
    LocationPermissions = require('./location-permissions'),
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
            Custom({
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
