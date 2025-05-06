'use strict';
var { MongoClient } = require('mongodb');
var { ejson, entries } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var prepareCache = require('./prepare-cache');

var createHelperSetItems = require('./create-helper-set-items');
var createPersonnel = require('./create-personnel');
var createLocations = require('./create-locations');
var createSubjectGroups = require('./create-subject-groups');
var createChimpanzees = require('./create-chimpanzees');

var helperSetItems = {
    'Chimpanzee Sub-Species': [
        'Central African chimpanzee - Pan troglodytes troglodytes',
        'East African chimpanzee - Pan troglodytes schweinfurthi',
        'Nigeria chimpanzee - Pan troglodytes ellioti',
        'West African chimpanzee - Pan troglodytes verus',
    ],
    'Origin': [
        'captive-born',
        'wild-born'
    ],
    'Rearing History': [
        'hand-reared',
        'mother-reared',
    ]
}


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
    
    await createPersonnel(context);
   
    for (var [ setLabel, items ] of entries(helperSetItems)) {
        await createHelperSetItems({ ...context, setLabel, items });
    }
    
    await createLocations(context);
    await createSubjectGroups(context);
    await createChimpanzees(context);

    mongo.close();
}
