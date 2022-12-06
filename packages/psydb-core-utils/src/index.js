'use strict';
var { isPlainObject, isPromise } = require('is-what');

module.exports = {
    isPlainObject,
    isPromise,
    compareIds: require('./compare-ids'),

    arrify: require('./arrify'),
    unique: require('./unique'),
    entries: require('./entries'),

    hasNone: require('./has-none'),
    hsaOnlyOne: require('./has-only-one'),

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
    
    flatten: require('@cdxoo/flat').flatten,
    unflatten: require('@cdxoo/flat').unflatten,
    ejson: require('@cdxoo/tiny-ejson'),
}
