'use strict';
var { MongoClient } = require('mongodb');
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var prepareCache = require('./prepare-cache');

var createLanguageItems = require('./create-language-items');
var createStudyTopics = require('./create-study-topics');

var createResearchGroups = require('./create-research-groups');
var createPersonnel = require('./create-personnel');

var createInstituteRooms = require('./create-instituterooms');
var createKigaUmbrellaOrgs = require('./create-kiga-umbrella-orgs');
var createKigas = require('./create-kigas');
var createAdults = require('./create-adults');
var createChildren = require('./create-children');

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
    await createStudyTopics(context);

    await createResearchGroups(context);
    await createPersonnel(context);

    await createInstituteRooms(context);
    await createKigaUmbrellaOrgs(context);
    await createKigas(context);
    await createAdults(context);
    await createChildren(context);

    mongo.close();
}
