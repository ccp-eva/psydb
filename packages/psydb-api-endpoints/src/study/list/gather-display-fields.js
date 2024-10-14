'use strict';
var { fetchCRTSettings } = require('@mpieva/psydb-api-lib');

var gatherDisplayFields = async (bag) => {
    var { db, collection, recordType, target } = bag;

    var crtSettings = await fetchCRTSettings({
        db, collectionName: collection, recordType, wrap: true
    });

    return crtSettings.augmentedDisplayFields(target);
}

module.exports = gatherDisplayFields;
