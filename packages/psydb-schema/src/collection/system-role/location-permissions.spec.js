'use strict';
var expect = require('chai').expect,
    createTree = require('../../entities/create-all-entity-data/create-tree'),
    CombinedTypePermissions = require('./util/combined-type-permissions'),
    FieldAccessMap = require('./util/field-access-map'),
    LocationPermissions = require('./location-permissions');

describe('LocationPermissions()', () => {
    it('creates permission schema that includes all subtypes', () => {
        var typedSchemas = [
            {
                entity: 'location',
                type: 'building',
                subtype: 'institute',
                schemas: {
                    state: {
                        type: 'object',
                        properties: {
                            foo: { type: 'string' },
                        }
                    }
                }
            },
            {
                entity: 'location',
                type: 'room',
                subtype: 'default',
                schemas: {
                    state: {
                        type: 'object',
                        properties: {
                            language: { type: 'string' }
                        }
                    },
                }
            },
            {
                entity: 'location',
                type: 'gps',
                schemas: {
                    state: {
                        type: 'object',
                        properties: {
                            language: { type: 'string' }
                        }
                    },
                }
            },
            {
                entity: 'location',
                type: 'foo',
                schemas: {
                    state: {
                        type: 'object',
                        properties: {
                            language: { type: 'string' }
                        }
                    },
                }
            },
        ];

        var locationNode = createTree(typedSchemas).location;
        //console.dir(locationNode.children, { depth: null });

    
        var permissions = LocationPermissions({
            schemaTreeNode: locationNode,
        });

        console.dir(permissions, { depth: 6 });

        expect(permissions.properties)
            .to.have.property('enableMinimalReadAccess');

        expect(permissions.required).to.eql([
            'enableMinimalReadAccess',
            'types',
        ]);

        expect(permissions.properties.types.properties._building).to.eql(
            CombinedTypePermissions({
                schemaTreeNode: locationNode.children.building
            }),
        );

        expect(permissions.properties._room).to.eql(
            CombinedTypePermissions({
                schemaTreeNode: locationNode.children.room
            }),
        );

        expect(permissions.properties.gps).to.eql({
            type: 'object',
            properties: {
                _state: FieldAccessMap({
                    schema: locationNode.children.gps.schemas.state
                }),
            },
            required: [ '_state' ]
        });

    });
});
