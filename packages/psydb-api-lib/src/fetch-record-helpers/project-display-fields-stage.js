'use strict';
var { entries } = require('@mpieva/psydb-core-utils');
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
        for (var [ path, value ] of entries(additionalProjection)) {
            displayFieldProjection[path] = value;
        }
    }

    return ({ $project: {
        type: true,
        ...displayFieldProjection
    }});
}

module.exports = ProjectDisplayFieldsStage;
