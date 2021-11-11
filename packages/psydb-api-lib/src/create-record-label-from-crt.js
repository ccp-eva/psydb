'use strict';
var createRecordLabel = require('./create-record-label');

var createRecordLabelFromCRT = (options) => {
    var {
        customRecordType,
        record,
    } = options;

    var recordLabelDefinition = (
        customRecordType.state.recordLabelDefinitions
    );

    return createRecordLabel({
        recordLabelDefinition,
        record,
    })
}

module.exports = createRecordLabelFromCRT;
