'use strict';
var { MongoClient } = require('mongodb');

var connectClient = async (bag) => {
    var { url: mongodbConnectString } = bag;

    var mongo = await MongoClient.connect(
        mongodbConnectString, { useUnifiedTopology: true }
    );

    return mongo;
}

module.exports = connectClient;
