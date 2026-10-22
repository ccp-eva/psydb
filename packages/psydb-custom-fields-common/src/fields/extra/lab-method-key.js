'use strict';
var { translate } = require('@mpieva/psydb-common-translations');
var { createStringifyValue } = require('../../stringify-utils');

var createQuickSearchSchema = undefined;

// NOTE: ignores 'short' since there are no short variants
var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value, i18n: { language } = {}} = bag;
    return translate(language, `_labMethod_${value}`);
}});

module.exports = {
    canBeCustomField: false,
    canBeDisplayField: true,

    canBeLabelToken: true, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
