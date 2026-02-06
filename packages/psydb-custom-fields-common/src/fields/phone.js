'use strict';
var { SaneString } = require('@mpieva/psydb-schema-fields');
var { JustString } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return SaneString();
};

var stringifyValue = JustString();

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
