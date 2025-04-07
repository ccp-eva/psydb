'use strict';
var { ExtBool } = require('@mpieva/psydb-schema-fields');
var { JustTranslate } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return ExtBool();
};

var stringifyValue = JustTranslate({
    prefix: '_ExtBool_'
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
