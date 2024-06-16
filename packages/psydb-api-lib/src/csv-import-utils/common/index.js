module.exports = {
    gatherRefs: require('./gather-refs'),
    resolveRefs: require('./resolve-refs'),
    replaceRefs: require('./replace-refs'),
    makeObjects: require('./make-objects'), // FIXME: make obs

    dumbParseCSV: require('./dumb-parse-csv'),
    dumbMakeObjects: require('./dumb-make-objects'),
    parseDefinedCSV: require('./parse-defined-csv'), // FIXME make obs
    parseSchemaCSV: require('./parse-schema-csv'),
    deserializers: require('./deserializers'),

    resolveSchemaRefs: require('./resolve-schema-refs'),
}
