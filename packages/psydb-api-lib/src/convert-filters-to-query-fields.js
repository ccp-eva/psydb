'use strict';
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var convertFiltersToQueryFields = ({
    filters,
    displayFields,
    fieldTypeMetadata,
}) => {
    var displayFieldsByDataPointer = keyBy({
        items: displayFields,
        byProp: 'dataPointer'
    });

    var queryFields = [];
    for (var dataPointer of Object.keys(filters)) {
        var value = filters[dataPointer];
        var displayField = displayFieldsByDataPointer[dataPointer];
        var metadata = fieldTypeMetadata[displayField.systemType];

        queryFields.push({
            systemType: displayField.systemType,
            searchType: metadata.searchType,
            dataPointer,
            value
        });
    }
    return queryFields;
}

module.exports = convertFiltersToQueryFields;
