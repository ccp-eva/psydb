'use strict';
var { SaneString } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../utils');

var createQuickSearchSchema = () => {
    return SaneString();
};

var stringifyValue = createStringfyValue({ fn: (bag) => {
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
    canBeLabelField: false,
    canSearch: true, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
