'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var internalsSchema = {
    type: 'object',
    properties: {
        subjectScientificId: ForeignId('subjectScientific'),
    },
    required: [
        'subjectScientificId',
    ],
};

module.exports = internalsSchema;
