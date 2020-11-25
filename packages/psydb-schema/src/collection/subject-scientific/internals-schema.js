'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var internalsSchema = {
    type: 'object',
    properties: {
        subjectGdprId: ForeignId('subjectGdpr'),
        participatedInStudyIds: {
            type: 'array',
            default: [],
            items: ForeignId('study'),
        },
    },
    required: [
        'subjectGdprId',
        'participatedInStudyIds',
    ],
};

module.exports = internalsSchema;
