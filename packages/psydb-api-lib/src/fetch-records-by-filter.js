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

var collectionHasSubChannels = (collection) => (
    allSchemaCreators[collection].hasSubChannels
);

var fetchRecordByFilter = async ({
    db,
    collectionName,
    recordType,
    permissions,
    hasSubChannels,

    enableResearchGroupFilter = true,
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
    
    if (collectionName === 'customRecordType') {
        if (enableResearchGroupFilter) {
            var { projectedResearchGroupIds } = permissions;

            //var childlabId = 'VVuQ9Z4dp6o5rmhbhMwvQ';
            //allowedResearchGroupIds = [ childlabId ];

            var researchGroupRecords = await (
                db.collection('researchGroup').aggregate([
                    { $match: {
                        _id: { $in: projectedResearchGroupIds },
                    }},
                    StripEventsStage(),
                ]).toArray()
            );

            var allowedTypeKeys = [];
            for (var rg of researchGroupRecords) {
                var {
                    recordTypePermissions = {}
                } = rg.state;

                for (var target of Object.keys(recordTypePermissions)) {
                    var items = recordTypePermissions[target];
                    allowedTypeKeys.push(...items.map(it => (
                        it.typeKey
                    )))
                }
            }

            stages.push(
                { $match: {
                    type: { $in: allowedTypeKeys }
                }}
            );
        }
    }

    if (recordType) {
        stages.push(
            { $match: {
                type: recordType,
            }}
        );
    }
    
    if (collectionName === 'subject') {
        stages.push({
            $match: {
                'isDummy': false,
                'scientific.state.internals.isRemoved': false,
            }
        });
    }
    else {
        stages.push({
            $match: {
                'isDummy': { $ne: true },
                ...(
                    hasSubChannels
                    ? { 'scientific.state.internals.isRemoved': { $ne: true }}
                    : { 'state.internals.isRemoved': { $ne: true }}
                ),
            }
        });
    }

    var FooStages = ({ permissions, collection }) => {
        var {
            hasRootAccess,
            forcedResearchGroupId,
            researchGroupIdsByCollection,
        } = permissions
        if (hasRootAccess && !forcedResearchGroupId) {
            return [];
        }
        else {
            var allowedResearchGroupIds = (
                researchGroupIdsByCollection[collection].read
            );
            var statePath = (
                collectionHasSubChannels(collection)
                ? 'scientific.state'
                : 'state'
            );
            var stages = [
                { $match: { $or: [
                    // NOTE: we have collections that do not have
                    // record based systempermissions but instead
                    // only require collection access
                    { [`${statePath}.systemPermissions`]: { $exists: false }},
                    { [`${statePath}.systemPermissions.accessRightsByResearchGroup.researchGroupId`]: { $in: allowedResearchGroupIds }},
                ]}}
            ];
            return stages;
        }
    }

    stages = [
        ...stages,
        ...(additionalPreprocessStages || []),
        ...(
            disablePermissionCheck
            ? []
            //: SystemPermissionStages({
            : FooStages({
                collection: collectionName,
                permissions,
            })
        ),
        /*StripEventsStage({
            subChannels: (
                hasSubChannels
                ? [ 'gdpr', 'scientific' ]
                : undefined
            )
        })*/
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
    
    var index = {
        sequenceNumber: 1,
        isDummy: 1,
        ...(recordType && {
            type: 1
        }),
        ...(
            hasSubChannels
            ? { 'scientific.state.internals.isRemoved': 1 }
            : { 'state.internals.isRemoved': 1 }
        )
    }
    await db.collection(collectionName).createIndex(index, {
        name: 'searchIndex'
    });

    var countResult = await (
        db.collection(collectionName)
        .aggregate(
            [ ...stages, { $count: 'COUNT' } ],
            {
                hint: 'searchIndex',
                allowDiskUse: true,
            }
        )
        .toArray()
    );
    var totalRecordCount = (
        countResult && countResult[0] ? countResult[0].COUNT : 0
    );
    console.log({ totalRecordCount });

    if (recordLabelDefinition) {
        stages.push(
            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition
            })
        );
    }

    //console.log(additionalProjection);

    if (displayFields) {
        /*stages.push(ProjectDisplayFieldsStage({
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
        }))*/
    }

    if (sort) {
        /*stages.push({
            $sort: {
                [sort.path]: sort.direction === 'desc' ? -1 : 1
            }
        })*/
    }
    else {
        if (displayFields && displayFields.length > 0) {
            var { pointer, dataPointer } = displayFields[0];
            var sortPath = convertPointerToPath(pointer || dataPointer);
            /*stages.push({
                $sort: { [sortPath]: 1 }
            })*/
        }
    }

    /*stages.push({
        $facet: {
            records: [
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }
    })*/

    //console.log(collectionName);
    //console.dir(stages, { depth: null });
    //throw new Error();*/

    /*await db.collection('subject').dropIndexes()
    await db.collection('subject').createIndex({
        'type': 1
    }, { name: 'ix__type' });
    console.log(await db.collection('subject').indexes());*/

    /*await db.collection('subject').createIndex({
        'scientific.state.internals.isRemoved': 1
    }, { name: 'ix_isRemoved'});
    await db.collection('subject').createIndex({
        'type': 1,
        'scientific.state.internals.isRemoved': 1
    }, { name: 'ix__type_and_isRemoved' });*/

    //console.log(collectionName);
    
    /*console.dir(await (
        db.collection(collectionName)
        .aggregate(
            [
                ...stages.slice(0,1),
            ],
            {
                //hint: { 'type': 1 },
                allowDiskUse: true,
                collation: { locale: 'de@collation=phonebook' }
            }
        )
        .explain('executionStats')
    ), { depth: null });*/

 
    console.dir(stages, { depth: null });
    var resultSet = await (
        db.collection(collectionName)
        .aggregate(
            //_s
            [
                ...stages,
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            {
                hint: 'searchIndex',
                allowDiskUse: true,
                collation: { locale: 'de@collation=phonebook' }
            }
        )
        //.explain()
        .toArray()
    );
    //console.log(facets);
    //console.dir(facets.stages[0]['$cursor'].queryPlanner.winningPlan, { depth: 4 });
    //console.dir(facets.queryPlanner.winningPlan, { depth: 4 });
    //return;
    //var [ resultSet, totalRecordCount ] = fromFacets(facets);

    console.dir(resultSet, { depth: null });

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
