'use strict';
var { initDB, fetchCRTs, gatherRefCache, gatherLabeledIds }
    = require('../../../utils');
var createCatShelterOrgs = require('./create-cat-shelter-orgs');
//var createCatShelters = require('./create-cat-shelters');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;

    var db = await initDB(extraOptions);
    var ids = await gatherLabeledIds({ db });
    var refcache = await gatherRefCache({ db });
    var crts = await fetchCRTs({ db });
    
    var context = { driver, refcache, ids, crts };

    await createCatShelterOrgs(context);
    //await createCatShelters(context);

    db.close();
}
