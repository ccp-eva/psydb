'use strict';
var { MongoClient } = require('@mpieva/psydb-mongo-adapter');
var config = require('@mpieva/psydb-api-config');

var doConnectLocal = async function (bag = {}) {
    if (this.context.mongo.local) {
        return;
    }

    var { url, dbName, ...extraOptions } = config.db;

    var client = new MongoClient(url, extraOptions);
    await client.connect();
    
    var dbHandle = client.db(dbName);

    this.context.mongo.local = {
        uri: url,
        client,
        dbName,
        dbHandle,
    };
}

module.exports = doConnectLocal;
