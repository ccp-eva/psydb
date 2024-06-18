'use strict';
var { gatherPossibleRefs } = require('@mpieva/psydb-schema-utils');

module.exports = {
    gatherPossibleRefs,

    gatherRefs: require('./gather-refs'), // FIXME: make obs
    createRefMappings: require('./create-ref-mappings'),

    resolveRefs: require('./resolve-refs'),
    replaceRefs: require('./replace-refs'), // FIXME: make obs,
    replaceRefsByMapping: require('./replace-refs-by-mapping'),
    makeObjects: require('./make-objects'), // FIXME: make obs

    dumbParseCSV: require('./dumb-parse-csv'),
    dumbMakeObjects: require('./dumb-make-objects'),
    parseDefinedCSV: require('./parse-defined-csv'), // FIXME make obs
    parseSchemaCSV: require('./parse-schema-csv'),
    deserializers: require('./deserializers'), // FIXME: make obs

}
