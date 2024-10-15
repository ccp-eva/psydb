'use strict';
var { BiologicalGender } = require('@mpieva/psydb-schema-fields');
var { JustTranslate } = require('../stringify-utils');

var createQuickSearchSchema = (bag = {}) => {
    var { definition } = bag;
    return BiologicalGender(); // XXX: enable other/unknown from definition
};

var stringifyValue = JustTranslate({
    prefix: '_BiologicalGender_'
});

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
