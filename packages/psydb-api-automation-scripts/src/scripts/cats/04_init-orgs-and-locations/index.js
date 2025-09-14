'use strict';
var WrappedCache = require('../../../wrapped-cache');
var { initDB, gatherLabeledIds } = require('../../../utils');

var prepareCache = require('./prepare-cache');
var createCatShelterOrgs = require('./create-cat-shelter-orgs');
var createCatShelters = require('./create-cat-shelters');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;

    var db = await initDB(extraOptions);
    var cache = WrappedCache({ driver, db });
    var ids = await gatherLabeledIds({ db });
    
    var context = { driver, cache, ids };

    await prepareCache(context);
    
    await createCatShelterOrgs(context);
    await createCatShelters(context);

    db.close();
}
