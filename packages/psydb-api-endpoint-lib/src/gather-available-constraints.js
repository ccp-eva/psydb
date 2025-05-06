'use strict';
var {
    gatherAvailableConstraintsForRecordType
} = require('@mpieva/psydb-api-lib');

var gatherAvailableConstraints = async (bag) => {
    var { db, collection, recordType } = bag;

    // TODO: base this of crtSettings
    return await gatherAvailableConstraintsForRecordType({
        db, collectionName: collection, recordType,
    });
}

module.exports = gatherAvailableConstraints; 
