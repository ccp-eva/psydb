'use strict';
var { Id } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return Id();
};

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { definition, value, related } = bag;
    var { props } = definition;
    var { collection } = props;

    var labels = [];
    for (var _id of value) {
        var label = related.records?.[collection]?.[_id]?._recordLabel;
        if (!label) {
            label = `[${_id}]`
        }
        labels.push(label);
    }

    return labels.join(', '); // FIXME: ', ' used here but '; ' in hsi
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
