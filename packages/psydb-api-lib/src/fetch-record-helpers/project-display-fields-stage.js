'use strict';
var convertPointerToPath = require('../convert-pointer-to-path');

var ProjectDisplayFieldsStage = ({
    displayFields,
    additionalProjection,
}) => {
    var displayFieldProjection = {};
    for (var field of displayFields) {
        var mongoPath = convertPointerToPath(field.dataPointer);
        displayFieldProjection[mongoPath] = true;
    }

    if (additionalProjection) {
        for (var path of Object.keys(additionalProjection)) {
            displayFieldProjection[path] = true;
        }
    }

    return ({ $project: {
        type: true,
        ...displayFieldProjection
    }});
}

module.exports = ProjectDisplayFieldsStage;
