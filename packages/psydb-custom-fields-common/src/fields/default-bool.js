'use strict';
var { DefaultBool } = require('@mpieva/psydb-schema-fields');

var createQuickSearchSchema = () => {
    return DefaultBool();
};

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
}
