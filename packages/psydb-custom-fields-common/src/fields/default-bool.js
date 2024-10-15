'use strict';
var { DefaultBool } = require('@mpieva/psydb-schema-fields');
var { JustTranslate } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return DefaultBool();
};

var stringifyValue = JustTranslate({
    prefix: '_DefaultBool_', fallback: 'ERROR'
});

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
