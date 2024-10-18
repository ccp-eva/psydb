'use strict';
var { Id } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return Id();
};

var createLabelToken = (bag = {}) => {
    var { value, related, i18n } = bag;
    // NOTE: something like this maybe?
}

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { definition, value, related, i18n } = bag;
    var { props } = definition;
    var { collection } = props;

    var relatedItem = related.records?.[collection]?.[value];
    var label = (
        relatedItem?.state?.displayNameI18N?.[language]
        || relatedItems?.state?.label
    )
    if (!label) {
        label = `[${value}]`
    }

    return label;
}});

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
