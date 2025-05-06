'use strict';
var fspath = require('path');
var co = require('co');
var RJSON = require('relaxed-json');
var { EJSON } = require('bson');
var dump = require('@cdxoo/mongodb-dump');

var cli = require('./setup-cli');
var cwd = process.cwd();

var connectClient = require('./connect-client');

co(async () => {
    var now = new Date();
    var { config: configPath, outPath } = cli.opts();

    var fullConfigPath = fspath.resolve(fspath.join(cwd, configPath));
    var fullOutPath = fspath.resolve(fspath.join(cwd, outPath));

    var { url, collections: collectionConfig } = require(fullConfigPath);

    var collections = [];
    var parsedFilters = {};
    for (var it of Object.entries(collectionConfig)) {
        var [ collection, filterString ] = it;

        var preparsed = JSON.stringify(RJSON.parse(filterString));
        var sanitized = preparsed.replace(
            /"\$regex":"\/([^/]*)\/([^"])*"/g,
            '"$regex": "$1", "$options": "$2"'
        );
        
        //console.log(sanitized);
        var parsed = EJSON.parse(sanitized);
        //console.log(parsedFilter);
       
        collections.push(collection);
        parsedFilters[collection] = parsed;
    }
    
    var client = await connectClient({ url });
    try {
        var db = client.db();
        console.log(`Connected to "${url}"`);
        console.log(`Database is "${db.databaseName}"`);

        console.log('Will dump to:', fullOutPath);

        var counts = {};
        await dump.database({
            con: client,
            database: db.databaseName,
            collections,

            filter: ({ database, collection }) => {
                return parsedFilters[collection] || undefined;
            },
            transform: ({ collection, doc }) => {
                counts[collection] = (counts[collection] || 0) + 1;
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
}).catch(error => { console.log(error) });
