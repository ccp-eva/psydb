'use strict';
var inline = require('@cdxoo/inline-text'),
    prefix = require('./schema-id-prefix');

var CustomSubjectSchema = () => ({
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `${prefix}/state`,
    type: 'object',
    properties: {
        entity: { enum: ['subject']},
        type: { enum: [ 'animal', 'human' ]},
        subtype: EntityTypeString(),

        customScientificSchema: {
            $ref: 'http://json-schema.org/draft-07/schema#'
        },
        customGdprSchema: {
            $ref: 'http://json-schema.org/draft-07/schema#'
        }
    },
    required: [
        'entity',
        'type',
        'subtype',
        'customScientificSchema',
    ],
})
