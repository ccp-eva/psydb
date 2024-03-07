'use strict';
var stringifyPath = require('@cdxoo/stringify-path-perlstyle');
var getUniqueObjectPaths = require('./get-unique-object-paths');

var fetchCollectionFieldPaths = async (bag) => {
    var { db, collection, stages, stringified = false } = bag;
    
    // NOTE: parseData is so vast that we omit the nested stuff
    // which speeds things up signifficantly
    stages = stages || (
        collection === 'document'
        ? [
            { $project: {
                'data.cache.parseData': false,
                'data.commits.data.parseData': false
            }},
            { $addFields: {
                'data.cache.parseData': { $const: {} },
                'data.commits.data.parseData': { $const: {} }
            }}
        ]
        : []
    )

    var recordPaths = {};
    var cursor = db.collection(collection).aggregate(stages);
    while (await cursor.hasNext()) {
        var record = await cursor.next();

        for (var path of getUniqueObjectPaths(record)) {
            var key = stringifyPath(path, { includeScalarTypes: true });
            if (!recordPaths[key]) {
                recordPaths[key] = path;
            }
        }
    }

    return (
        stringified
        ? Object.keys(recordPaths)
        : Object.values(recordPaths)
    );
}

module.exports = fetchCollectionFieldPaths;
