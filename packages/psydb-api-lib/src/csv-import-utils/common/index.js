'use strict';
module.exports = {
    runDefaultPipeline: require('./run-default-pipeline'),

    parseSchemaCSV: require('./parse-schema-csv'),
    injectRefIds: require('./inject-ref-ids'),
 
    dumbParseCSV: require('./dumb-parse-csv'),
    dumbMakeObjects: require('./dumb-make-objects'),
    
    gatherPossibleRefs: require('./gather-possible-refs'),
    createRefMappings: require('./create-ref-mappings'),
    resolveRefs: require('./resolve-refs'),
    replaceRefsByMapping: require('./replace-refs-by-mapping'),
    
    //deserializers: require('./deserializers'), // FIXME: make obs
}
