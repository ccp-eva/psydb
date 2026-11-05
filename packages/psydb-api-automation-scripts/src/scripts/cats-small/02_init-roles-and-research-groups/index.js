'use strict';
var WrappedCache = require('../../../wrapped-cache');
var { initDB, gatherLabeledIds } = require('../../../utils');

var prepareCache = require('./prepare-cache');
var createSystemRoles = require('./create-system-roles');
var createResearchGroup = require('./create-research-group');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}, idgen } = bag;

    var db = await initDB(extraOptions);
    var cache = WrappedCache({ driver, db });
    var ids = await gatherLabeledIds({ db });

    var context = { driver, cache, ids, idgen };

    await prepareCache(context);
    
    await createSystemRoles(context);
    await createResearchGroup(context);

    db.close();
}
