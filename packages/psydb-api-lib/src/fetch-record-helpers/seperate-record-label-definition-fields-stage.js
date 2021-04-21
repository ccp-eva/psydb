'use strict';
var convertPointerToPath = require('../convert-pointer-to-path');
    
var SeperateRecordLabelDefinitionFieldsStage = ({
    recordLabelDefinition,
}) => {
    var recordLabelFieldProjection = {};
    for (var field of recordLabelDefinition.tokens) {
        var mongoPath = convertPointerToPath(field.dataPointer);
        var key = `_recordLabelDefinitionFields.${mongoPath}`;
        recordLabelFieldProjection[key] = '$' + mongoPath;
    }
    return ({ $addFields: recordLabelFieldProjection });
};

module.exports = SeperateRecordLabelDefinitionFieldsStage;
