'use strict';
// FIXME: why is that called AgeFrameInterval? its just an AgeFrame
var { SaneString } = require('@mpieva/psydb-schema-fields');
var { createStringifyValue } = require('../../stringify-utils');
var AgeFrameBoundary = require('./age-frame-boundary');

var createQuickSearchSchema = undefined;

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { value } = bag;

    var start = AgeFrameBoundary.stringifyValue({
        ...bag, value: value.start
    });
    var end = AgeFrameBoundary.stringifyValue({
        ...bag, value: value.end
    });

    return `${start} - ${end}`;
}});

module.exports = {
    canBeCustomField: false,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
