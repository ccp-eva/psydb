'use strict';
var { Id } = require('@mpieva/psydb-schema-fields');

var createQuickSearchSchema = () => {
    return Id();
};

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
}
