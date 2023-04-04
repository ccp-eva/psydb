'use strict';
var stringifyFieldValue = require('./stringify-field-value');

var createDefaultFieldDataTransformer = (bag) => {
    var {
        related,
        timezone,

        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = bag;

    if (related) {
        relatedRecordLabels = related.records;
        relatedHelperSetItems = related.helperSets;
        relatedCustomRecordTypeLabels = related.crts;
    }

    var transformer = ({ value, definition }) => (
        stringifyFieldValue({
            rawValue: value,
            fieldDefinition: definition,

            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        })
    );

    return transformer;
}

module.exports = createDefaultFieldDataTransformer;
