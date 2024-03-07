'use strict';
var { MongoClient, ObjectId } = require('mongodb');
module.exports = {
    MongoClient,
    ObjectId,

    crc32: require('crc/crc32'),
    faker: require('@faker-js/faker').faker,

    inline: require('@cdxoo/inline-text'),
    mongodump: require('@cdxoo/mongodb-dump'),
    
    traverse: require('@cdxoo/traverse'),
    stringifyPath: require('@cdxoo/stringify-path-perlstyle'),
    gatherPossibleJSSPaths: require('@cdxoo/gather-possible-jss-paths'),
}
