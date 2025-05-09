'use strict';
var debug = require('debug')('psydb:api:lib:fetch-records-by-filter');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var apiConfig = require('@mpieva/psydb-api-config');

var { ejson, arrify, isPromise } = require('@mpieva/psydb-core-utils');
var { SmartArray } = require('@mpieva/psydb-common-lib');
var futils = require('@mpieva/psydb-custom-fields-mongo');

var {
    SystemPermissionStages,
    ProjectDisplayFieldsStage,
    SeperateRecordLabelDefinitionFieldsStage,
    StripEventsStage,
    MatchConstraintsStage,
} = require('../fetch-record-helpers');

var convertPointerToPath = require('../convert-pointer-to-path');
var createRecordLabel = require('../create-record-label');
var fromFacets = require('../from-facets');
var maybeStages = require('../maybe-stages');

var {
    createCRTCollectionStages,
    isNotDummyStage,
    isNotRemovedStage,
    isNotHiddenStage,
    createPermissionCheckStages,
} = require('./precount-stages');

var createCountIndex = require('./create-count-index');

var collectionHasSubChannels = (collection) => (
    allSchemaCreators[collection].hasSubChannels
);

var defaultMongoExtraOptions = {
    collation: {
        locale: 'de@collation=phonebook',
        numericOrdering: true,
    }
}

var fetchRecordByFilter = async (bag) => {
    var {
        db,
        collectionName,
        recordType,
        permissions,
        hasSubChannels,

        enableResearchGroupFilter = true,
        onlyIds,
        extraIds, // TODO: how to best handle extraIds ?
        excludedIds,
        constraints,
        queryFields,

        displayFields,
        recordLabelDefinition,
        additionalPreprocessStages,
        additionalProjection,

        target,
        disablePermissionCheck,
        showHidden,
        offset,
        limit,
        
        sort,
        timezone,
        language,
        locale,
    } = bag;

    offset = offset || 0;
    limit = limit || 0;

    var {
        dev_showDummyRecordsAsTopOptions = false,
    } = apiConfig;

    //console.log(queryFields)

    var preCountStages = [
        ...(await maybeStages({
            condition: (
                collectionName === 'customRecordType'
                && enableResearchGroupFilter
            ),
            stages: () => createCRTCollectionStages({ db, permissions })
        })),

        ...maybeStages({
            condition: recordType,
            stages: [
                { $match: {
                    type: recordType,
                }}
            ]
        }),

        ...maybeStages({
            condition: (
                permissions && collectionName === 'helperSet' && !permissions.isRoot()
                && permissions.availableHelperSetIds
            ),
            stages: () => ([
                { $match: {
                    _id: { $in: permissions.availableHelperSetIds }
                }}
            ])
        }),

        ...maybeStages({
            condition: (
                !(target === 'optionlist' && dev_showDummyRecordsAsTopOptions)
            ),
            stages: [ isNotDummyStage() ],
        }),

        isNotRemovedStage({ hasSubChannels }),

        ...maybeStages({
            condition: Array.isArray(onlyIds),
            stages: [
                { $match: {
                    _id: { $in: onlyIds }}
                }
            ]
        }),

        ...maybeStages({
            condition: Array.isArray(excludedIds) && excludedIds.length > 0,
            stages: [
                { $match: {
                    _id: { $nin: excludedIds }}
                }
            ]
        }),
       
        ...(additionalPreprocessStages || []),

        ...maybeStages({
            condition: !showHidden,
            stages: [
                isNotHiddenStage({ hasSubChannels }),
            ]
        }),

        ...maybeStages({
            condition: !disablePermissionCheck,
            stages: () => createPermissionCheckStages({
                permissions, collection: collectionName
            })
        }),

        ...maybeStages({
            condition: constraints && Object.keys(constraints).length > 0,
            stages: () => ([
                MatchConstraintsStage({ constraints })
            ])
        }),

        ...maybeStages({
            condition: queryFields && queryFields.length > 0,
            stages: () => futils.createMatchStages({
                type: 'quick-search',
                from: queryFields.map((it) => {
                    var { field, value } = it;
                    var systemType, pointer;
                    if (it.field) {
                        systemType = (field.systemType || field.type);
                        pointer = (field.pointer || field.dataPointer);
                    }
                    else {
                        systemType = (it.systemType || it.type);
                        pointer = (it.pointer || it.dataPointer);
                    }

                    return {
                        definition: { systemType, pointer },
                        input: value,
                    }
                }),
            }),
        }),
    ];

    //console.dir(ejson(preCountStages), { depth: null });
    //showHidden = showHidden || (queryFields && queryFields.length > 0);

    var index = {
        sequenceNumber: 1,
        isDummy: 1,
        ...(recordType && {
            type: 1
        }),
        ...(
            hasSubChannels
            ? {
                'scientific.state.internals.isRemoved': 1,
                'scientific.state.systemPermissions.isHidden': 1,
            }
            : {
                'state.internals.isRemoved': 1,
                'state.systemPermissions.isHidden': 1,
            }
        )
    }
    await db.collection(collectionName).ensureIndex(index, {
        name: 'searchIndex'
    });

    await createCountIndex({
        db,
        collection: collectionName
    });

    debug('counting records');
    var countResult = await (
        db.collection(collectionName)
        .aggregate(
            [ ...preCountStages, { $count: 'COUNT' } ],
            {
                hint: 'countIndex1',
                allowDiskUse: true,
            }
        )
        .toArray()
    );
    debug('done counting records');
    var totalRecordCount = (
        countResult && countResult[0] ? countResult[0].COUNT : 0
    );
    console.log({ totalRecordCount });

    var labelStage = undefined;
    if (recordLabelDefinition) {
        labelStage = (
            SeperateRecordLabelDefinitionFieldsStage({
                recordLabelDefinition
            })
        );
    }

    //console.log(additionalProjection);

    var displayFieldStage = undefined;
    if (displayFields) {
        displayFieldStage = ProjectDisplayFieldsStage({
            displayFields,
            additionalProjection: {
                type: true,
                '_isHidden': (
                    hasSubChannels
                    ? '$scientific.state.systemPermissions.isHidden'
                    : '$state.systemPermissions.isHidden'
                ),
                ...(recordLabelDefinition && {
                    '_recordLabelDefinitionFields': true 
                }),
                // FIXME: not sure if thats good
                ...(collectionName === 'customRecordType' && {
                    'collection': true,
                }),
                ...additionalProjection
            }
        });
        //console.dir(displayFieldStage, { depth: null });
    }

    var sortStage;
    if (sort) {

        // XXX: that doesnt do shit
        // FIXME: this is a hotfix
        if (systemType === 'Address') {
            sortPath += '.street';
        }

        await db.collection(collectionName).ensureIndex({
            [sort.path]: 1
        }, {
            ...defaultMongoExtraOptions
            //name: 'manualSortIndex__' + sort.path.replace('.', '_'),
        });

        sortStage = { $sort: {
            ...(target === 'optionlist' && dev_showDummyRecordsAsTopOptions && {
                isDummy: -1,
            }),
            [sort.path]: sort.direction === 'desc' ? -1 : 1
        }};
    }
    else {
        if (displayFields && displayFields.length > 0) {
            var { systemType, pointer, dataPointer } = displayFields[0];
            var sortPath = convertPointerToPath(pointer || dataPointer);

            // FIXME: this is a hotfix
            if (systemType === 'Address') {
                sortPath += '.street';
            }

            await db.collection(collectionName).ensureIndex({
                [sortPath]: 1
            }, {
                ...defaultMongoExtraOptions
            });

            sortStage = { $sort: {
                ...(target === 'optionlist' && dev_showDummyRecordsAsTopOptions && {
                    isDummy: -1,
                }),
                [sortPath]: 1
            }};
        }
    }

    /*postCountStages.push(...[
        { $skip: offset },
        ...(limit ? [{ $limit: limit }] : [])
    ]);*/

    /*stages.push({
        $facet: {
            records: [
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }
    })*/

    var postCountStages = [
        labelStage,
        displayFieldStage
    ].filter(it => !!it);


    debug('searching records');
    var searchStages = [
        ...(
            sort 
            ? [
                sortStage,
                ...preCountStages,
            ]
            : [
                ...preCountStages,
                sortStage,
            ]
        ),
        { $skip: offset },
        ...(limit ? [{ $limit: limit }] : []),
        ...postCountStages,
    ].filter(it => !!it); // FIXME: sortstage might be undefined

    var resultSet = await (
        db.collection(collectionName)
        .aggregate(
            searchStages,
            {
                ...defaultMongoExtraOptions,
                //...(sort && {
                //    hint: 'manualSortIndex1',
                //}),
                //hint: 'searchIndex',
                allowDiskUse: true,
            }
        )
        //.explain()
        .toArray()
    );
    debug('done searching records');
    //console.dir(resultSet, { depth: null });
    //console.dir(facets.stages[0]['$cursor'].queryPlanner.winningPlan, { depth: 4 });
    //console.dir(facets.queryPlanner.winningPlan, { depth: 4 });
    //return;
    //var [ resultSet = [], totalRecordCount ] = fromFacets(facets);

    //console.dir(resultSet, { depth: null });

    if (recordLabelDefinition) {
        resultSet.forEach(it => {
            it._recordLabel = createRecordLabel({
                record: it._recordLabelDefinitionFields,
                definition: recordLabelDefinition,
                timezone, language, locale,
            });
            delete it._recordLabelDefinitionFields;
        })
    }
    
    // FIXME: this is bad; return them seperately as []
    resultSet.totalRecordCount = totalRecordCount
    
    return resultSet;
}

module.exports = fetchRecordByFilter;
