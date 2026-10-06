'use strict';
var { initDB, fetchCRTs, gatherRefCache, gatherLabeledIds }
    = require('../../../utils');
var createCatTrainers = require('./create-cat-trainers');
var createCatOwners = require('./create-cat-owners');
var createCats = require('./create-cats');

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;

    var db = await initDB(extraOptions);
    var ids = await gatherLabeledIds({ db });
    var refcache = await gatherRefCache({ db });
    var crts = await fetchCRTs({ db });

    await prepareRefCache({ db, refcache });

    var context = { driver, refcache, ids, crts };

    await createCatTrainers(context);
    await createCatOwners(context);
    await createCats(context);

    db.close();
}

var prepareRefCache = async (bag) => {
    var { db, refcache } = bag;
    var data = refcache.data();

    // NOTE: the faker expects helper set items keyed by their set
    var items = await db.collection('helperSetItem').find({}, {
        projection: { _id: true, setId: true }
    }).toArray();

    data.helperSetItem = {};
    for (var it of items) {
        var setId = String(it.setId);
        (data.helperSetItem[setId] = data.helperSetItem[setId] || [])
            .push(it._id);
    }

    // NOTE: the faker needs every referenced list to exist,
    // even when there are no records yet
    data.subjectGroup = data.subjectGroup || [];
    data.subject = data.subject || {};
    for (var type of [ 'catTrainer', 'catOwner', 'cat' ]) {
        data.subject[type] = data.subject[type] || [];
    }
}
