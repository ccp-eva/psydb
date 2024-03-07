'use strict';
var { readdirSync, writeFileSync, unlinkSync } = require('fs');
var fspath = require('path');

var { entries } = require('@mpieva/psydb-core-utils');
var { MongoClient } = require('@mpieva/psydb-mongo-adapter');

var {
    fetchCollections,
    fetchCollectionFieldPaths,
} = require('../utils');

var updateFieldCache = async (bag) => {
    var { config, cachedir } = bag;
    var { url, dbName, onlyCollections, skippedCollections } = config;

    var client = new MongoClient(url, {
        useUnifiedTopology: true,
    });

    var con = await client.connect();
    var db = con.db(dbName);

    try {
        var cachedFiles = readdirSync(cachedir);
        cachedFiles = cachedFiles.filter(it => /\.json$/.test(it));
        for (var it of cachedFiles) {
            unlinkSync(fspath.join(cachedir, it));
        }

        var allPaths = await gatherAllFieldPaths({
            db, onlyCollections, skippedCollections
        });
        
        for (var [ collection, paths ] of entries(allPaths)) {
            var cachefile = fspath.join(cachedir, `${collection}.json`);
            var tmpjson = JSON.stringify(paths, null, 4);
            writeFileSync(cachefile, tmpjson, { flag: 'w' });
        }
    }
    finally {
        con.close();
    }
}

var gatherAllFieldPaths = async (bag) => {
    var { db, onlyCollections, skippedCollections = [] } = bag;

    var allCollections = await fetchCollections({
        db, onlyCollections, skippedCollections
    });

    var out = {};
    for (var collection of allCollections) {
        console.log('analyzing collection', collection);

        var paths = [];
        var paths = await fetchCollectionFieldPaths({
            db, collection, stringified: true
        });

        // skipping nested _rohrpostMetadata paths of present
        paths = paths.filter(it => (
            !it.startsWith('%_rohrpostMetadata -> ')
        ))

        paths.sort((a,b) => {
            var saneA = a.replace(/[$%@&](<[^>]+>)?/g, '');
            var saneB = b.replace(/[$%@&](<[^>]+>)?/g, '');

            return saneA.localeCompare(saneB)
        });

        out[collection] = paths;
    }

    return out;
}

module.exports = updateFieldCache;
