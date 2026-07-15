'use strict';
var { isArray, isPlainObject, isPromise } = require('is-what');

module.exports = {
    isArray,
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
    keySequence: require('./key-sequence'),

    unwind: require('./unwind'),
    only: require('./only'),
    omit: require('./omit'),
    range: require('./range'),
    transliterate: require('./transliterate'),
    ucfirst: require('./ucfirst'),

    includes: require('./includes'),
    intersect: require('./intersect'),
    maybeIntersect: require('./maybe-intersect'),
    without: require('./without'),

    extractFrom: require('./extract-from'),

    isInstanceOf: require('./is-instance-of'),
    
    merge: require('./deep-merge'),
    pathify: require('./pathify'),
    seperateNulls: require('./seperate-nulls'),
    queryObject: require('./query-object'),
    forcePush: require('./force-push'),
    uniquePush: require('./unique-push'),

    convertSchemaPointerToMongoPath: require('./schemapointer-to-mongopath'),
    
    prefixify: require('./prefixify'),
    jsonify: require('./jsonify'),

    keys: Object.keys,

    convertPathToPointer: require('@cdxoo/objectpath-to-jsonpointer'),
    convertPointerToPath: require('@cdxoo/jsonpointer-to-objectpath'),
    traverse: require('@cdxoo/traverse'),
    flatten: require('@cdxoo/flat').flatten,
    unflatten: require('@cdxoo/flat').unflatten,
    ejson: require('@cdxoo/tiny-ejson'),
   
    jsonpointer: require('jsonpointer'),
    copy: require('copy-anything').copy,
    escapeRX: require('escape-string-regexp'),

    JsonBase64: require('@cdxoo/json-base64').JsonBase64,
}
