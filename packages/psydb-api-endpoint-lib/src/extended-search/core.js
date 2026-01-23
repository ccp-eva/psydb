'use strict';
var debug = require('debug')(
    'psydb:api-endpoint-lib:extended-earch:core'
);

var sift = require('sift');
var inline = require('@cdxoo/inline-string');

var { ejson } = require('@mpieva/psydb-core-utils');
var {
    aggregateToArray,
    aggregateCount
} = require('@mpieva/psydb-mongo-adapter');

var {
    SmartArray,
    fromFacets,

    fetchOneCustomRecordType,
    convertPointerToPath,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    createCustomQueryValues,
    createCustomFieldMatchStages
} = require('./utils');

var extendedSearchCore = async (bag) => {
    var {
        db,
        collection,
        permissions,
        recordType,

        specialFilterConditions,
        specialFilterProjection,
        
        customFilters,
        customGdprFilters,
        customScientificFilters,

        columns,
        sort,
        offset = 0,
        limit = 0,
    } = bag;

    var crt = await fetchOneCustomRecordType({
        db,
        collection,
        type: recordType
    });

    if (
        !permissions.hasFlag('canAccessSensitiveFields')
        && crt.state.commentFieldIsSensitive
    ) {
        columns = columns.filter(it => it !== '/scientific/state/comment')
    }

    var {
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: collection,
        customRecordType: recordType,
        target: 'table',
        permissions
    });
    
    // FIXME: generalzie the creation of the field parts
    // see extended search columns
    var addressFields = availableDisplayFieldData.filter(
        sift({ type: 'Address' })
    );
    if (addressFields.length > 0) {
        for (var it of addressFields) {
            var block = [
                {
                    key: it.key + '.city',
                    type: 'SaneString',
                    displayName: `Ort (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/city',
                    dataPointer: it.dataPointer + '/city',
                },
                {
                    key: it.key + '.postcode',
                    type: 'SaneString',
                    displayName: `PLZ (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/postcode',
                    dataPointer: it.dataPointer + '/postcode',
                },
                {
                    key: it.key + '.street',
                    type: 'SaneString',
                    displayName: `Straße (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/street',
                    dataPointer: it.dataPointer + '/street',
                },
                {
                    key: it.key + '.housenumber',
                    type: 'SaneString',
                    displayName: `Nummer (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/housenumber',
                    dataPointer: it.dataPointer + '/housenumber',
                },
                {
                    key: it.key + '.affix',
                    type: 'SaneString',
                    displayName: `Zusatz (${it.displayName})`,
                    props: {},
                    subChannel: it.subChannel,
                    pointer: it.pointer + '/affix',
                    dataPointer: it.dataPointer + '/affix',
                }
            ];

            availableDisplayFieldData.push(...block);
        }
    }

    var { fields, subChannelFields } = crt.state.settings;
    if (subChannelFields) {
        var permissionStatePath = 'scientific.state';
        var customFields = {
            scientific: (
                subChannelFields.scientific.filter(it => !it.isRemoved)
            ),
            gdpr: (
                subChannelFields.gdpr.filter(it => !it.isRemoved)
            )
        };

        var customFieldMatchStages = [
            ...createCustomFieldMatchStages({
                definitions: customFields.scientific,
                inputs: customScientificFilters,
            }),
            ...createCustomFieldMatchStages({
                definitions: customFields.gdpr,
                inputs: customGdprFilters,
            }),
        ]

        var customQueryValues = {
            ...createCustomQueryValues({
                fields: customFields.scientific,
                filters: customScientificFilters,
            }),
            ...createCustomQueryValues({
                fields: customFields.gdpr,
                filters: customGdprFilters,
            }),
        }
    }
    else {
        var permissionStatePath = 'state';
        var customFields = (
            fields.filter(it => !it.isRemoved)
        );

        var customFieldMatchStages = [
            ...createCustomFieldMatchStages({
                definitions: customFields,
                inputs: customFilters,
            }),
        ]

        var customQueryValues = {
            ...createCustomQueryValues({
                fields: customFields,
                filters: customFilters,
            }),
        }
    }

    var permissionFullPath = inline`
        ${permissionStatePath}
        .systemPermissions
        .accessRightsByResearchGroup
        .researchGroupId
    `;

    //console.dir(customQueryValues, { depth: null })
    //console.log(specialFilterConditions);
    //
    var mainStages = SmartArray([
        { $match: {
            isDummy: { $ne: true },
            'scientific.state.internals.isRemoved': { $ne: true },
            'state.internals.isRemoved': { $ne: true },
            ...(recordType && { type: recordType }),
            //...customQueryValues,
            //...specialFilterConditions,
        }},

        ...customFieldMatchStages,
        
        ( specialFilterConditions && { $match: (
            specialFilterConditions
        )}),

        ( !permissions.isRoot() && { $match: {
            [permissionFullPath]: { $in: (
                permissions.getCollectionFlagIds(collection, 'read')
            )}
        }}),
        
        { $project: {
            sequenceNumber: true,
            type: true,
            ...columns.reduce((acc, pointer) => ({
                ...acc,
                [ convertPointerToPath(pointer) ]: true
            }), {}),
            ...specialFilterProjection,

            _isHidden: `$${permissionStatePath}.systemPermissions.isHidden`
        }},

        SortStage({ ...sort }),

        // NOTE: hits limit "generated document in $facet" ist 100MB or sth
        //{ $facet: {
        //    records: [
        //        { $skip: offset },
        //        ...(limit ? [{ $limit: limit }] : [])
        //    ],
        //    recordsCount: [{ $count: 'COUNT' }]
        //}}
    ]).filter(it => !!it);

    debug('counting records');
    var recordsCount = await aggregateCount({
        db, [collection]: mainStages,
        mongoSettings: { allowDiskUse: true }
    }) || 0;
    debug('done counting records: ', recordsCount);

    debug('searching records');
    var records = await aggregateToArray({
        db, [collection]: [
            ...mainStages,
            SortStage({ ...sort }),
            { $skip: offset },
            ...(limit ? [{ $limit: limit }] : [])
        ],
        mongoSettings: {
            allowDiskUse: true,
            collation: { locale: 'de@collation=phonebook' }
        }
    });
    debug('done searching records');
    
    var related = await fetchRelatedLabelsForMany({
        db, collectionName: collection,
        recordType, records,
    });

    return {
        records, recordsCount, related,
        displayFieldData: availableDisplayFieldData,
    };
}

var SortStage = (options) => {
    var { column, direction = 'asc' } = options;
    if (!column) {
        return undefined;
    }
    var path = convertPointerToPath(column);
    return { $sort: {
        [path]: direction === 'desc' ? -1 : 1,
    }}
}

module.exports = extendedSearchCore;
