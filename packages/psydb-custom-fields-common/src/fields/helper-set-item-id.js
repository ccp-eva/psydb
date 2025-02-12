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
    var { setId } = props;

    var { language } = i18n;

    var relatedItem = related.helperSets?.[setId]?.[value];
    var label = (
        relatedItem?.state?.displayNameI18N?.[language]
        || relatedItem?.state?.label
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
