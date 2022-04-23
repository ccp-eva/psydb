// TODO: make obsolete its broken
'use strict';
var createRecordLabel = require('./create-record-label');

var createRecordLabelFromCRT = (options) => {
    var {
        customRecordType,
        record,
    } = options;

    var recordLabelDefinition = (
        customRecordType.state.recordLabelDefinitions
        || customRecordType.state.recordLabelDefinition // FIXME: which?
    );

    return createRecordLabel({
        recordLabelDefinition,
        record,
    })
}

module.exports = createRecordLabelFromCRT;
