'use strict';
var { SaneString } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../../stringify-utils');
var DateOnlyServerSide = require('../date-only-server-side');

var createQuickSearchSchema = undefined;

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value } = bag;

    var start = DateOnlyServerSide.stringifyValue({
        ...bag, value: value.start
    });
    var end = DateOnlyServerSide.stringifyValue({
        ...bag, value: value.end
    });

    return `${start} - ${end}`;
}});

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
