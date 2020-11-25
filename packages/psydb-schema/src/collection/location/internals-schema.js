'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var internalsSchema = {
    type: 'object',
    properties: {
        // TODO:
        // maybe reservation document ids?
    },
    required: [
        // TODO
    ],
};

module.exports = internalsSchema;
