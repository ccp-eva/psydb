'use strict';
var { MongoClient } = require('mongodb');

var initDB = async (bag) => {
    var { mongodb: mongodbConnectString } = bag;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }
    
    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );

    var db = mongo.db();
    db.close = mongo.close; // FIXME: thats hacky

    return db;
}

module.exports = initDB;
