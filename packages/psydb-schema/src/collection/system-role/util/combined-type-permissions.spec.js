'use strict';
var expect = require('chai').expect,
    createTree = require('../../../entities/create-all-entity-data/create-tree'),
    FieldAccessMap = require('./field-access-map'),
    CombinedTypePermissions = require('./combined-type-permissions');

describe('CombinedTypePermissions()', () => {
    it('combines gdpr and scientific schemas', () => {
        var typedSchemas = [
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

        var permissions = CombinedTypePermissions({
            schemaTreeNodes: schemaTree.subject.children.human.children
        });

        expect(permissions).to.eql({
            type: 'object',
            properties: {
                child: {
                    type: 'object',
                    properties: {
                        scientific: FieldAccessMap({
                            schema: typedSchemas[0].schemas.scientific.state
                        }),
                        gdpr: FieldAccessMap({
                            schema: typedSchemas[0].schemas.gdpr.state
                        }),
                    },
                    required: ['scientific', 'gdpr']
                },
            },
            required: [
                'child',
            ]
        });
    });
});
