'use strict';
var debug = require('debug')(
    'psydb:api-endpoint-lib:extended-earch:core'
);

var {
    fromFacets,

    fetchOneCustomRecordType,
    convertPointerToPath,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var extendedSearchCore = async (bag) => {
    var {
        db,
        collection,
        recordType,

        customFilters,
        specialFilterConditions,

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

    var {
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: collection,
        customRecordType: recordType,
        target: 'table',
    });

    // TODO
    var { fields } = crt.state.settings;
    var customFields = (
        fields.filter(it => !it.isRemoved)
    );

    var customQueryValues = {
        ...createCustomQueryValues({
            fields: customFields,
            filters: customFilters,
        }),
    }

    //console.dir(customQueryValues, { depth: null })

    var stages = [
        { $match: {
            ...convertPointerKeys(customQueryValues),
            ...specialFilterConditions,
        }},
        
        { $project: {
            sequenceNumber: true,
            type: true,
            ...columns.reduce((acc, pointer) => ({
                ...acc,
                [ convertPointerToPath(pointer) ]: true
            }), {})
        }},

        SortStage({ ...sort }),

        { $facet: {
            records: [
                { $skip: offset },
                ...(limit ? [{ $limit: limit }] : [])
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ].filter(it => !!it);

    //console.dir({ stages }, { depth: null });

    var facets = await (
        db.collection(collection).aggregate(
            stages,
            {
                allowDiskUse: true,
                collation: { locale: 'de@collation=phonebook' }
            }
        ).toArray()
    );
    
    var [ records, recordsCount ] = fromFacets(facets);

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: collection,
        recordType,
        records,
    });

    return {
        records,
        recordCount,
        related,

        displayFieldData
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
