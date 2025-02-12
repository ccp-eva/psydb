'use strict';
var { Id } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../stringify-utils');
var HelperSetItemId = require('./helper-set-item-id');

var createQuickSearchSchema = () => {
    return Id();
};

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { definition, value, related, i18n } = bag;
    var { props } = definition;
    var { setId } = props;

    var labels = [];
    for (var _id of value) {
        var label = HelperSetItemId.stringifyValue({
            ...bag, value: _id
        })
        labels.push(label);
    }

    return labels.join('; '); // FIXME: '; ' used here but ', ' in records
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
