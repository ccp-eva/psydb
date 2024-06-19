'use strict';
var debug = require('debug')('psydb:api-automation');
var co = require('co');
var fspath = require('path');
var { MongoClient } = require('mongodb');

var restore = require('@cdxoo/mongodb-restore');
var fixtures = require('@mpieva/psydb-fixtures');

var cli = require('./cli-setup');
var execute = require('./execute-with-driver');

var cwd = process.cwd();

var developmentApiKey = [
    'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
    'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
].join('');

co(async () => {
    var cliOptions = cli.opts();
    console.log(cliOptions);

    var {
        url,
        apiKey = developmentApiKey,
        restoreFixture: fixturePath,
        ...extraOptions
    } = cliOptions;


    var scripts = [];
    for (var it of cli.args) {
        var path = fspath.join(cwd, it);
        scripts.push(require(path));
    }

    if (fixturePath) {
        var {
            mongodb: mongodbConnectString,
        } = extraOptions

        if (!mongodbConnectString) {
            throw new Error('script requires mongodb connect string');
        }
        var mongo = await MongoClient.connect(
            mongodbConnectString,
            { useUnifiedTopology: true }
        );
        try {
            var db = mongo.db();
            debug('cleaning db ...');
            await db.dropDatabase();
            
            debug('restoring fixture ...');

            await restore.database({
                con: mongo,
                database: db.databaseName,
                from: fixtures.get(fixturePath, { db: true }),
                clean: true
            });
        }
        finally {
            mongo.close()
        }
    }

    for (var it of scripts) {
        await execute({
            url, apiKey, extraOptions,
            script: it
        });
    }
}).catch(error => { console.log(error) });
