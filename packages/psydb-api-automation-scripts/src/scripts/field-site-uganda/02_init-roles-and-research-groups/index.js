'use strict';
var { MongoClient } = require('mongodb');
var WrappedCache = require('../../../wrapped-cache');

var prepareCache = require('./prepare-cache');
var createSystemRoles = require('./create-system-roles');
var createResearchGroup = require('./create-research-group');

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
    
    await createSystemRoles(context);
    await createResearchGroup(context);

    mongo.close();
}
