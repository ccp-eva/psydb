'use strict';
var { Integer } = require('@mpieva/psydb-schema-fields');

var createQuickSearchSchema = () => {
    return Integer();
};

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    canBeLabelField: true,
    canSearch: true, // FIXME: rename: canQuickSearch

    createQuickSearchSchema,
}
