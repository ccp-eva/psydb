'use strict';
var { MongoClient } = require('mongodb');
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var prepareCache = require('./prepare-cache');

var createLanguageItems = require('./create-language-items');
var createResearchGroups = require('./create-research-groups');

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

    var cache = WrappedCache({ driver });
    var context = { apiKey, driver, db, cache };

    await prepareCache(context);
    
    await createLanguageItems(context);
    await createResearchGroups(context);

    mongo.close();
}
