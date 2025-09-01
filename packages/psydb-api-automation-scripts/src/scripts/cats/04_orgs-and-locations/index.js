'use strict';
var { MongoClient } = require('mongodb');
var WrappedCache = require('../../../wrapped-cache');

var prepareCache = require('./prepare-cache');
var createCatShelterOrgs = require('./create-cat-shelter-orgs');
var createCatShelters = require('./create-cat-shelters');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;

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
    
    await createCatShelterOrgs(context);
    await createCatShelters(context);

    mongo.close();
}
