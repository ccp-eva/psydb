'use strict';
var createRecordLabel = require('./create-record-label');

var createAllRecordLabels = (bag) => {
    var { collectionCRTSettings, records, timezone, from } = bag;

    var out = {};
    for (var it of records) {
        out[it._id] = createRecordLabel({
            record: it,
            definition: (
                collectionCRTSettings[it.type]
                .getRecordLabelDefinition()
            ),
            from,
            timezone
        })
    }
    return out;
}

module.exports = createAllRecordLabels;
