'use strict';
var { createStringifyValue } = require('../stringify-utils');

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value } = bag;
    return `(${value.latitude}, ${value.longitude})`;
}});

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema: undefined,
    stringifyValue,
}
