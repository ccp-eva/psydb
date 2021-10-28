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
var fromFacets = require('./from-facets');

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
    additionalProjection,

    disablePermissionCheck,
    offset,
    limit,
    
    sort,
}) => {
    offset = offset ||0;
    limit = limit || 0;

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
        ...(
            disablePermissionCheck
            ? []
            : SystemPermissionStages({ permissions, hasSubChannels })
        ),
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

    //console.log(additionalProjection);

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
                }),
                ...additionalProjection
            }
        }))
    }

    if (sort) {
        stages.push({
            $sort: {
                [sort.path]: sort.direction === 'desc' ? -1 : 1
            }
        })
    }

    stages.push({
        $facet: {
            records: [
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }
    })

    //console.log(collectionName);
    //console.dir(stages, { depth: null });
    //throw new Error();*/

    var facets = await (
        db.collection(collectionName).aggregate(stages).toArray()
    );
    var [ resultSet, totalRecordCount ] = fromFacets(facets);

    //console.dir(resultSet, { depth: null });

    if (recordLabelDefinition) {
        resultSet.forEach(it => {
            it._recordLabel = createRecordLabel({
                record: it._recordLabelDefinitionFields,
                definition: recordLabelDefinition,
            });
            delete it._recordLabelDefinitionFields;
        })
    }
    
    // FIXME: this is bad; return them seperately as []
    resultSet.totalRecordCount = totalRecordCount
    
    return resultSet;
}

module.exports = fetchRecordByFilter;
