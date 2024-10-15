'use strict';
var { BiologicalGender } = require('@mpieva/psydb-schema-fields');
var { translate } = require('@mpieva/psydb-common-translations');
var { createStringifyValue } = require('../utils');

var createQuickSearchSchema = (bag = {}) => {
    var { definition } = bag;
    return BiologicalGender(); // XXX: enable other/unknown from definition
};

var stringifyValue = createStringfyValue({ fn: (bag) => {
    var { value, i18n: { language }} = bag;
    return translate(language, `_BiologialGender_${value}`);
}});

// TODO
var createLabelToken = (bag = {}) => {
    var { value, i18n } = bag;
    return translate(value, { i18n });
}

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: true, // XXX ??
    canBeLabelField: true, // XXX ??
    
    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
