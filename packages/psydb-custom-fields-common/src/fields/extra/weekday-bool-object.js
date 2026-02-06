'use strict';
// FIXME: this should be moved to an extra-fields package
// or, alternatively this paackage should be named data-fields

var { SaneString } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../../stringify-utils');

var createQuickSearchSchema = undefined;

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
}
