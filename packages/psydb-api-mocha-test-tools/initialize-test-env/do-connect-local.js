'use strict';
var { MongoClient } = require('@mpieva/psydb-mongo-adapter');

var doConnectLocal = async function (bag = {}) {
    if (this.context.mongo.local) {
        return;
    }

    var client = new MongoClient(config.url, {
        useUnifiedTopology: true,
    });

    await client.connect();

    var { dbName } = config;
    var dbHandle = client.db(dbName);

    this.context.mongo.local = {
        client,
        dbName,
        dbHandle,
    };
}
