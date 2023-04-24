'use strict';
var fields = require('@mpieva/psydb-schema-fields');

var SearchFilters = (bag) => {
    var { metadata, availableFilterFields } = bag;

    var filters = {};
    for (var field of availableFilterFields) {
        var { systemType, dataPointer } = field;
        var {
            canSearch,
            searchType,
            searchDisplayType,
        } = metadata[systemType];

        if (canSearch) {
            var realType = searchDisplayType || searchType || systemType;
            var FieldSchema = fields[realType];
            
            // FIXME: props needed i guess
            // are stored in custom field settings
            // can be mapped
            // FIXME: on foreign id ... do we need collection and
            // other props here?
            filters[dataPointer] = FieldSchema({ collection: '__NONE' });
        }
    }
    return fields.ExactObject({
        properties: filters,
        required: []
    })
}

module.exports = { SearchFilters };
