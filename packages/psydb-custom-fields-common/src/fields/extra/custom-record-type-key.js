'use strict';
var { createStringifyValue } = require('../../stringify-utils');

var createQuickSearchSchema = undefined;

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { definition, value, related, i18n } = bag;
    var { collection } = definition.props;
    var { translate } = i18n;
    
    var crt = related.crts?.[collection]?.[value];
    
    return translate.crt(crt) || '[!!STRINGIFY_ERROR!!]';
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
