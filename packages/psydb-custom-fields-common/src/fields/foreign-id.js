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

    var label = related.records?.[collection]?.[value]?._recordLabel;
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
