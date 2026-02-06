'use strict';
var WrappedCache = require('../../../wrapped-cache');

var createHelperSets = require('./create-helper-sets');
var createCatShelterOrgCRT = require('./create-cat-shelter-org-crt');
var createCatShelterCRT = require('./create-cat-shelter-crt');
var createCatLabRoomCRT = require('./create-cat-lab-room-crt');
var createCatOwnerCRT = require('./create-cat-owner-crt');
var createCatCRT = require('./create-cat-crt');
var createCatStudyCRT = require('./create-cat-study-crt');

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { driver, cache };

    await createHelperSets(context);

    await createCatShelterOrgCRT(context);
    await createCatShelterCRT(context);
    await createCatLabRoomCRT(context);
    await createCatOwnerCRT(context);
    await createCatCRT(context);
    await createCatStudyCRT(context);
}
