'use strict';
var { MongoClient } = require('mongodb');
var WrappedCache = require('../../../wrapped-cache');

var prepareCache = require('./prepare-cache');
var createDummySubjects = require('./create-dummy-subjects');

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    
    var { mongodb: mongodbConnectString } = extraOptions;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }
    
    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );

    var db = mongo.db();

    var cache = WrappedCache({ driver, db });
    var context = { driver, cache };

    await prepareCache(context);
    await createDummySubjects({ ...context, subjects: [
        { firstname: 'Alice', lastname: 'Test' },
        { firstname: 'Alice', lastname: 'Test' },
        
        { firstname: 'Bob', lastname: 'Test' },
        { firstname: 'Bob', lastname: 'Test' },
        { firstname: 'Bob', lastname: 'Test' },
    ] });

    mongo.close();
}
