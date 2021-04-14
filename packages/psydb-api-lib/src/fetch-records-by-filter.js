'use strict';
var debug = require('debug')('psydb:api:lib:fetch-record-by-id');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var SystemPermissionStages = require('./fetch-record-helpers/system-permission-stages');

var convertPointerToPath = require('./convert-pointer-to-path');
var fieldTypeConversions = require('./mongodb-field-type-conversions');
var createRecordLabel = require('./create-record-label');

var fetchRecordByFilter = async ({
    db,
    collectionName,
    recordType,
    permissions,
    hasSubChannels,
    queryFields,
    displayFields,
    recordLabelDefinition,
}) => {
    var stages = [];

    if (recordType) {
        stages.push(
            { $match: {
                type: recordType
            }}
        );
    }
    
    stages = [
        ...stages,
        ...SystemPermissionStages({ permissions, hasSubChannels }),
    ]
    
    if (hasSubChannels) {
        stages.push(
            { $project: {
                'gdpr.events': false,
                'scientific.events': false,
            }}
        );
    }
    else {
        stages.push(
            { $project: {
                events: false,
            }}
        );
    }
    
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

    var allFields = [
        ...projectionFields,
        ...vanillaFields
    ];

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

    stages.push(
        { $match: matchStageValue }
    );


    if (projectionFields.length > 0) {
        var cleanupStageValue = {};
        for (var field of projectionFields) {
            cleanupStageValue[field.projectionKey] = false;
        }

        stages.push(
            { $project: cleanupStageValue }
        );
    }

    if (recordLabelDefinition) {
        var recordLabelFieldProjection = {};
        for (var field of recordLabelDefinition.tokens) {
            var mongoPath = convertPointerToPath(field.dataPointer);
            var key = `_recordLabelDefinitionFields.${mongoPath}`;
            recordLabelFieldProjection[key] = '$' + mongoPath;
        }

        stages.push(
            { $addFields: recordLabelFieldProjection }
        );
    }

    if (displayFields) {
        var displayFieldProjection = {};
        for (var field of displayFields) {
            var mongoPath = convertPointerToPath(field.dataPointer);
            displayFieldProjection[mongoPath] = true;
        }

        if (recordLabelDefinition) {
            displayFieldProjection._recordLabelDefinitionFields = true;
        }

        stages.push(
            { $project: displayFieldProjection }
        );
    }

    /*console.log(collectionName);
    console.log(stages);
    throw new Error();*/

    var resultSet = await (
        db.collection(collectionName).aggregate(stages).toArray()
    );

    console.dir(resultSet);

    if (recordLabelDefinition) {
        resultSet.forEach(it => {
            it._recordLabel = createRecordLabel({
                record: it._recordLabelDefinitionFields,
                definition: recordLabelDefinition,
            });
            delete it._recordLabelDefinitionFields;
        })
    }

    return resultSet;
}

module.exports = fetchRecordByFilter;
