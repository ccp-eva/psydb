'use strict';
var expect = require('chai').expect,
    CombinedTypePermissions = require('./combined-type-permissions'),
    SubjectPermissions = require('./subject-permissions');

describe('SubjectPermissions()', () => {
    it('creates permission schema that includes all subtypes', () => {
        var animalScientificStateItems = {
            dog: {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                }
            },
        };
    
        var humanScientificStateItems = {
            child: {
                type: 'object',
                properties: {
                    language: { type: 'string' }
                }
            }
        };

        var humanGdprStateItems = {
            child: {
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            }
        };

        var permissions = SubjectPermissions({
            animalScientificStateItems,
            humanScientificStateItems,
            humanGdprStateItems,
        });

        expect(permissions.properties)
            .to.have.property('enableMinimalReadAccess');

        expect(permissions.required).to.eql([
            'enableMinimalReadAccess',
            'animal',
            'human'
        ]);

        expect(permissions.properties.animal).to.eql(
            CombinedTypePermissions({
                scientificStateItems: animalScientificStateItems,
                gdprStateItems: {},
            }),
        );

        expect(permissions.properties.human).to.eql(
            CombinedTypePermissions({
                scientificStateItems: humanScientificStateItems,
                gdprStateItems: humanGdprStateItems,
            }),
        );

    });
});
