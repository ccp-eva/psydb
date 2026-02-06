'use strict';
var gatherDisplayFields = require('../gather-display-fields');
var gatherSharedDisplayFields = require('../gather-shared-display-fields');
var gatherAvailableConstraints = require('../gather-available-constraints');

var prepareFromCore = async (bag) => {
    var { db, collection, recordType, target } = bag;
    
    var displayFields = undefined;
    var availableConstraints = undefined;
    if (recordType) {
        displayFields = await gatherDisplayFields({
            db, collection: 'study', recordType, target,
        });
        availableConstraints = await gatherAvailableConstraints({
            db, collection: 'study', recordType
        }); // XXX
    }
    else {
        displayFields = await gatherSharedDisplayFields({
            db, collection: 'study', target,
        });
        availableConstraints = []; // XXX
    }
    
    return { displayFields, availableConstraints };
}

module.exports = prepareFromCore;
