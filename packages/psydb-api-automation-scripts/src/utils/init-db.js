'use strict';
var { MongoClient } = require('mongodb');

var openClients = [];

var initDB = async (bag) => {
    var { mongodb: mongodbConnectString } = bag;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }
    
    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );

    openClients.push(mongo);

    var db = mongo.db();
    db.close = mongo.close; // FIXME: thats hacky

    return db;
}

initDB.closeAll = async () => {
    var clients = openClients.splice(0);
    for (var it of clients) {
        await it.close();
    }
}

module.exports = initDB;
