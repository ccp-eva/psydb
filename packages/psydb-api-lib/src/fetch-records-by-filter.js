'use strict';
var debug = require('debug')('psydb:api:lib:fetch-record-by-id');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    SystemPermissionStages,
    ProjectDisplayFieldsStage,
    SeperateRecordLabelDefinitionFieldsStage,
    StripEventsStage,
    QuickSearchStages,
    MatchConstraintsStage,
} = require('./fetch-record-helpers');

var convertPointerToPath = require('./convert-pointer-to-path');
var fieldTypeConversions = require('./mongodb-field-type-conversions');
var createRecordLabel = require('./create-record-label');

var fetchRecordByFilter = async ({
    db,
    collectionName,
    recordType,
    permissions,
    hasSubChannels,

    constraints,
    queryFields,

    displayFields,
    recordLabelDefinition,
    additionalPreprocessStages,
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
        ...(additionalPreprocessStages || []),
        ...SystemPermissionStages({ permissions, hasSubChannels }),
        StripEventsStage({
            subChannels: (
                hasSubChannels
                ? [ 'gdpr', 'scientific' ]
                : undefined
            )
        })
    ];

    if (constraints) {
        stages = [
            ...stages,
            MatchConstraintsStage({ constraints })
        ]
    }

    if (queryFields && queryFields.length > 0) {
        stages = [
            ...stages,
            ...QuickSearchStages({
                queryFields,
                fieldTypeConversions,
            })
        ];
    }
    
    if (recordLabelDefinition) {
        stages.push(
            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition
            })
        );
    }

    if (displayFields) {
        stages.push(ProjectDisplayFieldsStage({
            displayFields,
            additionalProjection: {
                type: true,
                ...( recordLabelDefinition && {
                    '_recordLabelDefinitionFields': true 
                }),
                // FIXME: not sure if thats good
                ...(collectionName === 'customRecordType' && {
                    'collection': true,
                })
            }
        }))
    }

    /*console.log(collectionName);
    console.log(stages);
    throw new Error();*/

    var resultSet = await (
        db.collection(collectionName).aggregate(stages).toArray()
    );

    //console.dir(resultSet);

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
