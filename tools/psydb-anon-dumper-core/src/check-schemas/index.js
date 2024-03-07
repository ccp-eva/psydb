'use strict';
var debug = require('../debug')('checkSchemas');

var { readdirSync, readFileSync } = require('fs');
var fspath = require('path');

var {
    MongoClient,
    stringifyPath
    gatherPossibleJSSPaths,
} = require('../externals');

var { findMatchingSchemaPath } = require('../utils');


var checkSchemas = async (bag) => {
    var { config, cachedir, schemas } = bag;
    var { url, dbName, onlyCollections, skippedCollections } = config;
    //console.log({ config });

    var client = new MongoClient(url, {
        useUnifiedTopology: true,
    });

    var con = await client.connect();
    var db = con.db(dbName);

    debug('checking schemas');
    try {
        var cachedFiles = readdirSync(cachedir);
        cachedFiles = cachedFiles.filter(it => /\.json$/.test(it));
        for (var it of cachedFiles) {
            var collection = it.replace(/\.json$/, '');
            debug(`    ${collection}`);
            if (skippedCollections.includes(collection)) {
                continue;
            }
  
            var Schema = schemas[collection];
            if (!Schema) {
                throw new Error(`missing schema for '${collection}'`);
            }
            var schema = Schema().createJSONSchema();
            var schemaPaths = gatherPossibleJSSPaths(schema);

            var cachedPaths = require(fspath.join(cachedir, it));
            var parsedPaths = [];
            for (var str of cachedPaths) {
                parsedPaths.push(parsePath(str));
            }

            var missingPaths = [];
            for (var path of parsedPaths) {
                var foundMatchingPath = findMatchingSchemaPath({
                    path, schemaPaths
                });
                if (!foundMatchingPath) {
                    missingPaths.push(path);
                }
            }

            if (missingPaths.length > 0) {
                console.log(missingPaths);
                console.log(stringifyPath.all(missingPaths, {
                    includeScalarTypes: true
                }));
                throw new Error(`missing paths in '${collection}'`);
            }

        }
    }
    finally {
        con.close();
    }
}

var parsePath = (str) => {
    var parsedTokens = str.split(' -> ').map(t => {
        if (t.startsWith('$')) {
            var key = t.replace(/^.*>/, '');
            var type = t.replace(/(^.<|>[^>]*$)/g, '');
            return { key, type };
        }
        else if (t.startsWith('@')) {
            var key = t.slice(1);
            return { key, type: 'array' }
        }
        else if (t.startsWith('%')) {
            var key = t.slice(1);
            return { key, type: 'object' }
        }
    });

    return parsedTokens;
}

module.exports = checkSchemas;
