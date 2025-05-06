'use strict';
var { SaneString } = require('@mpieva/psydb-schema-fields');
var { JustLocaleDate } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return SaneString();
};

var stringifyValue = JustLocaleDate({ format: 'P' });

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??
    
    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue
}
