'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var internalsSchema = {
    type: 'object',
    properties: {
        participatedInStudyIds: {
            type: 'array',
            default: [],
            items: ForeignId('study'),
        },
    },
    required: [
        'participatedInStudyIds',
    ],
};

module.exports = internalsSchema;
