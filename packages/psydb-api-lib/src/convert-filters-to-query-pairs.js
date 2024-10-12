'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');

var convertFiltersToQueryPairs = (bag) => {
    var { filters = {}, displayFields } = bag;

    var displayFieldsByPointer = keyBy({
        items: displayFields,
        byProp: 'dataPointer'
    });

    var pairs = [];
    for (var pointer of Object.keys(filters)) {
        var definition = displayFieldsByPointer[pointer];
        var input = filters[pointer];

        definition.pointer = definition.dataPointer; // FIXME

        pairs.push({ definition, input })
    }
    return pairs;
}

module.exports = convertFiltersToQueryPairs;
