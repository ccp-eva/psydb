'use strict';
var { ExtBool } = require('@mpieva/psydb-schema-fields');

var createQuickSearchSchema = () => {
    return ExtBool();
};

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
}
