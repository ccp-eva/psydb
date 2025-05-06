'use strict';
var { Integer } = require('@mpieva/psydb-schema-fields');
var { JustString } = require('../stringify-utils');

var createQuickSearchSchema = () => {
    return Integer();
};

var stringifyValue = JustString();

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    canBeLabelField: true,
    canSearch: true, // FIXME: rename: canQuickSearch

    createQuickSearchSchema,
    stringifyValue,
}
