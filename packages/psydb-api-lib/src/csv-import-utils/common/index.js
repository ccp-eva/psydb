'use strict';
module.exports = {
    runDefaultPipeline: require('./run-default-pipeline'),

    parseSchemaCSV: require('./parse-schema-csv'),
    injectRefIds: require('./inject-ref-ids'),
 
    dumbParseCSV: require('./dumb-parse-csv'),
    dumbMakeObjects: require('./dumb-make-objects'),
    
    gatherPossibleRefs: require('./inject-ref-ids/gather-possible-refs'),
    createRefMappings: require('./inject-ref-ids/create-ref-mappings'),
    resolveRefs: require('./inject-ref-ids/resolve-refs'),
    replaceRefsByMapping: require('./inject-ref-ids/replace-refs-by-mapping'),
    
    //deserializers: require('./deserializers'), // FIXME: make obs
}
