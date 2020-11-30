'use strict';
var expect = require('chai').expect,
    FieldAccessMap = require('./field-access-map'),
    CombinedTypePermissions = require('./combined-type-permissions');

describe('CombinedTypePermissions()', () => {
    it('combines gdpr and scientific schemas', () => {
        var scientificStateItems = {
            dog: {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                }
            },
            cat: {
                type: 'object',
                properties: {
                    bar: { type: 'string' },
                }
            },
        };
    
        var gdprStateItems = {
            dog: {
                type: 'object',
                properties: {
                    owner: { type: 'string' }
                }
            }
        };

        var permissions = CombinedTypePermissions({
            scientificStateItems,
            gdprStateItems
        });

        expect(permissions).to.eql({
            type: 'object',
            properties: {
                dog: {
                    type: 'object',
                    properties: {
                        scientific: FieldAccessMap({
                            schema: scientificStateItems.dog
                        }),
                        gdpr: FieldAccessMap({
                            schema: gdprStateItems.dog
                        }),
                    },
                    required: ['scientific', 'gdpr']
                },
                cat: {
                    type: 'object',
                    properties: {
                        scientific: FieldAccessMap({
                            schema: scientificStateItems.cat
                        }),
                    },
                    required: ['scientific']
                },
            },
            required: [
                'dog',
                'cat'
            ]
        });
    });
});
