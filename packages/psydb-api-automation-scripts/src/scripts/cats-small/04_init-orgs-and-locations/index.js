'use strict';
var { initDB, fetchCRTs, gatherRefCache, gatherLabeledIds }
    = require('../../../utils');
var createCatSupportOrgs = require('./create-cat-support-orgs');
var createCatShelterPersons = require('./create-cat-shelter-persons');
var createCatShelters = require('./create-cat-shelters');
var createCatLabRooms = require('./create-cat-lab-rooms');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;

    var db = await initDB(extraOptions);
    var ids = await gatherLabeledIds({ db });
    var refcache = await gatherRefCache({ db });
    var crts = await fetchCRTs({ db });
    
    var context = { driver, refcache, ids, crts };

    await createCatSupportOrgs(context);
    await createCatShelterPersons(context);
    await createCatShelters(context);
    await createCatLabRooms(context);

    db.close();
}
