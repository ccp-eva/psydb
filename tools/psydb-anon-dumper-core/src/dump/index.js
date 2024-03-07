'use strict';
var debug = require('../debug')('dump');
var { MongoClient, mongodump } = require('../externals');

var { fetchCollections } = require('../utils');

var verifyNoMissingHandlers = require('./verify-no-missing-handlers');
var createTransformCallback = require('./create-transform-callback');
var makeCompatCollections = require('./make-compat-collections');


var dumpTransformed = async (bag) => {
    var { config, schemas, anonymizers } = bag;
    var {
        url, dbName,
        onlyCollections, skippedCollections,
        priorityCollections, collectionsToCache,
    } = config;

    var cache = {};

    var client = new MongoClient(url, {
        useUnifiedTopology: true,
    });

    var con = await client.connect();
    var db = con.db(dbName);

    try {
        var collections = await fetchCollections({
            db, priorityCollections, onlyCollections, skippedCollections
        });

        verifyNoMissingHandlers({
            collections, schemas, anonymizers
        });

        var T = new Date();
        await mongodump.database({
            //uri: url,
            con,
            database: dbName,
            collections,

            output: 'clone-db',
            to: {
                uri: 'mongodb://127.0.0.1',
                database: 'psydb_ANON'
            },
            transform: createTransformCallback({
                cache, collectionsToCache
            })
        })
        console.log('deltaT:', new Date().getTime() - T.getTime(), 'ms');
    }
    finally {
        con.close();
    }
}

module.exports = dumpTransformed;
