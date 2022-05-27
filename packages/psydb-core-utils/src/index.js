'use strict';
var { isPlainObject } = require('is-what');

module.exports = {
    isPlainObject,
    compareIds: require('./compare-ids'),

    arrify: require('./arrify'),
    unique: require('./unique'),
    entries: require('./entries'),

    groupBy: require('./group-by'),
    keyBy: require('./key-by'),
    unwind: require('./unwind'),
    only: require('./only'),
    range: require('./range'),
    transliterate: require('./transliterate'),
    
    intersect: require('./intersect'),
    without: require('./without'),

    extractFrom: require('./extract-from'),

    isInstanceOf: require('./is-instance-of'),
    
    convertPathToPointer: require('@cdxoo/objectpath-to-jsonpointer'),
    convertPointerToPath: require('@cdxoo/jsonpointer-to-objectpath'),

    merge: require('./deep-merge'),
    queryObject: require('./query-object'),
    forcePush: require('./force-push'),

    convertSchemaPointerToMongoPath: require('./schemapointer-to-mongopath'),
}
