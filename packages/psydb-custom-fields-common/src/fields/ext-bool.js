'use strict';
var { ExtBool } = require('@mpieva/psydb-schema-fields');
var { translate } = require('@mpieva/psydb-common-translations');
var { createStringifyValue } = require('../utils');

var createQuickSearchSchema = () => {
    return ExtBool();
};

var stringifyValue = createStringfyValue({ fn: (bag) => {
    var { value, i18n: { language }} = bag;
    return translate(language, `_ExtBool_${value}`);
}});

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
