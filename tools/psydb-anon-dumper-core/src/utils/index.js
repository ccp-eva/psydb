'use strict';
module.exports = {
    extendAnonTPrefix: require('./extend-anon-t-prefix'),
    getUniqueObjectPaths: require('./get-unique-object-paths'),
    findMatchingSchemaPath: require('./find-matching-schema-path'),
    
    fetchCollections: require('./fetch-collections'),
    fetchCollectionFieldPaths: require('./fetch-collection-field-paths'),

    ...require('./reseed-helpers'),
}
