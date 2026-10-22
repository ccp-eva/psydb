'use strict';
var { translate } = require('@mpieva/psydb-common-translations');
var { createStringifyValue } = require('../../stringify-utils');

var createQuickSearchSchema = undefined;

// NOTE: always uses the short variants
var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value, i18n: { language } = {}} = bag;
    return translate(language, `${value}_short`);
}});

module.exports = {
    canBeCustomField: false,
    canBeDisplayField: true,

    canBeLabelToken: false,
    canBeLabelField: false,

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
