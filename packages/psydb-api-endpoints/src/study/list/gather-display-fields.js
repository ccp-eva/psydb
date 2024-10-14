'use strict';
var { fetchCRTSettings } = require('@mpieva/psydb-api-lib');

var gatherDisplayFields = async (bag) => {
    var { db, collection, recordType, target } = bag;

    var crtSettings = await fetchCRTSettings({
        collection, recordType, wrap: true
    });

    return crt.augmentedDisplayFields(target);
}

module.exports = gatherDisplayFields;
