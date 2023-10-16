'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');

var QuickSearchStages = ({
    queryFields,
    fieldTypeConversions,
}) => {
    var stages = [];

    var {
        projectionFields,
        vanillaFields,
    } = seperateQueryFields({ queryFields, fieldTypeConversions });

    var addedFieldKeys = [];
    if (projectionFields.length > 0) {
        var addFieldsStageValue = {};

        for (var [ index, field ] of projectionFields.entries()) {
            var {
                projectionKey,
                createProjection,
                mongoPath,
            } = field;
            addFieldsStageValue[projectionKey] = createProjection(mongoPath);
        }

        stages.push({ $addFields: addFieldsStageValue })
    }

    stages.push(
        createMatchStage({
            allFields: [
                ...projectionFields,
                ...vanillaFields
            ]
        })
    );

    if (projectionFields.length > 0) {
        stages.push(
            createCleanupStage({ projectionFields })
        )
    }

    return stages;
}

var createCleanupStage = ({ projectionFields }) => {
    var cleanupStageValue = {};
    for (var field of projectionFields) {
        cleanupStageValue[field.projectionKey] = false;
    }

    return({ $project: cleanupStageValue });
}

var createMatchStage = ({ allFields }) => {
    var matchStageValue = {};
    for (var field of allFields) {
        var {
            mongoPath,
            realValue,
            projectionKey
        } = field;

        if (projectionKey) {
            matchStageValue[projectionKey] = realValue;
        }
        else {
            matchStageValue[mongoPath] = realValue;
        }
    }

    return ({ $match: matchStageValue });
}

var seperateQueryFields = ({
    queryFields,
    fieldTypeConversions,
}) => {
    
    var projectionFields = [],
        vanillaFields = [];
    for (var [ index, field ] of queryFields.entries()) {
        var {
            systemType,
            searchType,
            dataPointer,
            value
        } = field;

        // when searchType is not explicitaly set default to systemType
        searchType = searchType || systemType;

        var mongoPath = convertPointerToPath(dataPointer);

        var systemTypeConversions = fieldTypeConversions[systemType] || {};
        var searchTypeConversions = fieldTypeConversions[searchType] || {};

        var realValue = (
            searchTypeConversions.alterValue
            ? searchTypeConversions.alterValue(value)
            : value
        );

        if (systemTypeConversions.createProjection) {
            projectionFields.push({
                mongoPath,
                realValue,
                ...field,
                ...systemTypeConversions,
                projectionKey: `_temp_${index}`
            });
        }
        else {
            vanillaFields.push({
                mongoPath,
                realValue,
                ...field,
                ...systemTypeConversions,
            });
        }
    }

    return ({
        projectionFields,
        vanillaFields,
    });
}

module.exports = QuickSearchStages;
