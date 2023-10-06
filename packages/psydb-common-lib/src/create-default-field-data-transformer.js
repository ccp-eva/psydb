'use strict';
var stringifyFieldValue = require('./stringify-field-value');

var createDefaultFieldDataTransformer = (bag) => {
    var {
        related,
        timezone,
        locale,

        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = bag;

    if (related) {
        relatedRecordLabels = related.records;
        relatedHelperSetItems = related.helperSets;
        relatedCustomRecordTypeLabels = related.crts;
    }

    var transformer = ({ value, definition, record }) => (
        stringifyFieldValue({
            rawValue: value,
            fieldDefinition: definition,

            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,

            record,
            timezone,
            locale,
        })
    );

    return transformer;
}

module.exports = createDefaultFieldDataTransformer;
