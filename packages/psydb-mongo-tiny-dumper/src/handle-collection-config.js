'use strict';
var RJSON = require('relaxed-json');
var { EJSON } = require('bson');
var dump = require('@cdxoo/mongodb-dump');

var connectClient = require('./connect-client');

var handleCollectionConfig = async (bag) => {
    var { url, collectionConfig, fullOutPath } = bag;
    
    var collections = [];
    var collectionFilters = {};
    for (var it of Object.entries(collectionConfig)) {
        var [ collection, filterOrString ] = it;

        var filter = undefined;
        if (typeof filterOrString === 'string') {
            var preparsed = JSON.stringify(RJSON.parse(filterOrString));
            var sanitized = preparsed.replace(
                /"\$regex":"\/([^/]*)\/([^"])*"/g,
                '"$regex": "$1", "$options": "$2"'
            );
            
            filter = EJSON.parse(sanitized);
        }
        else if (typeof filterOrString === 'function') {
            filter = filterOrString;
        }
        else {
            filter = EJSON.parse(EJSON.stringify(filterOrString));
        }
           
        collections.push(collection);
        collectionFilters[collection] = filter;
    }
    
    var client = await connectClient({ url });
    try {
        var db = client.db();
        console.log(`Connected to "${url}"`);
        console.log(`Database is "${db.databaseName}"`);

        console.log('Will dump to:', fullOutPath);

        var counts = {};
        var cache = { docs: {}};
        await dump.database({
            con: client,
            database: db.databaseName,
            collections,

            filter: ({ database, collection }) => {
                var f = collectionFilters[collection] || undefined;
                var out = (
                    typeof f === 'function'
                    ? f({ database, collection, cache })
                    : f
                )
                return out;
            },
            transform: ({ collection, doc }) => {
                counts[collection] = (counts[collection] || 0) + 1;

                if (!cache.docs[collection]) {
                    cache.docs[collection] = [];
                }
                cache.docs[collection].push(doc);

                return doc;
            },
            output: 'fs-dir',
            to: fullOutPath
        })

        console.log('number of dumped records:', counts);
    }
    finally {
        client.close();
    }
}

module.exports = handleCollectionConfig;
