'use strict';
var { initDB, gatherRefCache, gatherLabeledIds } = require('../../../utils');
var createPersonnel = require('./create-personnel');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;

    var db = await initDB(extraOptions);
    var ids = await gatherLabeledIds({ db });
    var refcache = await gatherRefCache({ db });
    var context = { driver, refcache, ids };

    await createPersonnel(context);

    db.close();
}
