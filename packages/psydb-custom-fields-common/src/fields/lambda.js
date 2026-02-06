'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var calculateAge = require('@mpieva/psydb-calculate-age');

var stringifyValue = (bag) => {
    var {
        definition, value, related,
        i18n = {}, record = undefined
    } = bag;

    var { fn, input: pointer } = definition.props;
    var input = record ? jsonpointer.get(record, pointer) : undefined;

    switch (fn) {
        case 'deltaYMD':
            return !input ? '-' : calculateAge({
                base: input, relativeTo: new Date(), asString: true
            });
        default:
            return '[!!UNKNOWN_LAMBDA_TYPE!!]';
    }
};

module.exports = {
    canBeCustomField: true,
    canBeDisplayField: true,
    canBeLabelField: false,
    canSearch: false, // FIXME: rename: canQuickSearch
   
    createQuickSearchSchema: undefined,
    stringifyValue,
}
