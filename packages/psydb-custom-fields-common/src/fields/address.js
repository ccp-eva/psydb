'use strict';
var { SaneString } = require('@mpieva/psydb-schema-fields');

var createQuickSearchSchema = () => {
    return SaneString();
};

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    canBeLabelField: false,
    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
}
