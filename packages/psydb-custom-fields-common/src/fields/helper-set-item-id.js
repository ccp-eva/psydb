'use strict';
var { Id } = require('@mpieva/psydb-schema-fields');

var createQuickSearchSchema = () => {
    return Id();
};

var createLabelToken = (bag = {}) => {
    var { value, related, i18n } = bag;
    // NOTE: something like this maybe?
}

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
}
