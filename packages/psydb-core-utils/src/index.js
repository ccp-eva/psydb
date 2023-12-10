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
    hasSome: require('./has-some'),
    hasOnlyOne: require('./has-only-one'),

    groupBy: require('./group-by'),
    keyBy: require('./key-by'),
    unwind: require('./unwind'),
    only: require('./only'),
    omit: require('./omit'),
    range: require('./range'),
    transliterate: require('./transliterate'),
    ucfirst: require('./ucfirst'),

    includes: require('./includes'),
    intersect: require('./intersect'),
    without: require('./without'),

    extractFrom: require('./extract-from'),

    isInstanceOf: require('./is-instance-of'),
    
    convertPathToPointer: require('@cdxoo/objectpath-to-jsonpointer'),
    convertPointerToPath: require('@cdxoo/jsonpointer-to-objectpath'),

    merge: require('./deep-merge'),
    pathify: require('./pathify'),
    queryObject: require('./query-object'),
    forcePush: require('./force-push'),

    convertSchemaPointerToMongoPath: require('./schemapointer-to-mongopath'),
    
    flatten: require('@cdxoo/flat').flatten,
    unflatten: require('@cdxoo/flat').unflatten,
    ejson: require('@cdxoo/tiny-ejson'),
   
    prefixify: require('./prefixify'),

    jsonpointer: require('jsonpointer'),
    escapeRX: require('escape-string-regexp'),
}
