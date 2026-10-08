'use strict';
var { createStringifyValue } = require('../../stringify-utils');

var createQuickSearchSchema = undefined;

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value, i18n } = bag;
    var { translate } = i18n;

    var key = `_labWorkflow_${value}`;
    return translate ? translate(key) : value;
}});

module.exports = {
    canBeCustomField: false,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
