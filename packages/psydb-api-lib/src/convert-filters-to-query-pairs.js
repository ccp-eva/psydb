'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { __fixDefinitions } = require('@mpieva/psydb-common-compat');

var convertFiltersToQueryPairs = (bag) => {
    var { filters = {}, displayFields } = bag;
    displayFields = __fixDefinitions(displayFields);

    var displayFieldsByPointer = keyBy({
        items: displayFields,
        byProp: 'pointer'
    });

    var pairs = [];
    for (var pointer of Object.keys(filters)) {
        var definition = displayFieldsByPointer[pointer];
        var input = filters[pointer];

        pairs.push({ definition, input })
    }
    return pairs;
}

module.exports = convertFiltersToQueryPairs;
