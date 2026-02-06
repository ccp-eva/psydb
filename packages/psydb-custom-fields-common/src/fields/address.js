'use strict';
var { SaneString } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return SaneString();
};

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value } = bag;
    
    return ([
        value.street, value.housenumber, value.affix,
        value.postcode, value.city,
        // omitting country here,
    ].filter(it => !!it).join(' '));
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
