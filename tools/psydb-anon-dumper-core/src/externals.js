module.exports = {
    MongoClient: require('mongodb').MongoClient,
    crc32: require('./crc32'),
    faker: require('@faker-js/faker'),

    mongodump: require('@cdxoo/mongodb-dump'),
    inline: require('@cdxoo/inline-text'),
    gatherPossibleJSSPaths: require('@cdxoo/gather-possible-jss-paths'),
    stringifyPath: require('@cdxoo/stringify-path-perlstyle'),
}
