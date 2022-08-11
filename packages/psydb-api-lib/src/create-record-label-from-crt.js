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
    
    var out = createRecordLabel({
        definition: recordLabelDefinition,
        record,
    });

    return out;
}

module.exports = createRecordLabelFromCRT;
