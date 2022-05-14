'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedSearch:subjects'
);

var {
    ResponseBody,
    validateOrThrow,
    fromFacets,

    fetchOneCustomRecordType,
    convertPointerToPath,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,

    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { extendedSearch } = require('@mpieva/psydb-api-endpoint-lib');

var {
    createCustomQueryValues,
    convertPointerKeys,
} = require('../utils');

var RequestBodySchema = require('./request-body-schema');

var studyExtendedSearch = async (context, next) => {
    var {
        db,
        permissions,
        request
    } = context;

    validateOrThrow({
        schema: RequestBodySchema.Core(),
        payload: request.body
    });

    var {
        studyType
    } = request.body;

    var crtSettings = await fetchCRTSettings({
        db, collectionName: 'study', recordType: studyType,
    });

    validateOrThrow({
        schema: RequestBodySchema.Full(crtSettings),
        payload: request.body
    });

    var {
        customFilters,
        specialFilters,

        columns,
        sort,
        offset = 0,
        limit = 0
    } = request.body;

    ////////////////////////////
    /*var crt = await fetchOneCustomRecordType({
        db,
        collection: 'study',
        type: studyType
    });

    var {
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'study',
        customRecordType: studyType,
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
            ...createSpecialFilterConditions(specialFilters),
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
        db.collection('study').aggregate(
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
        collectionName: 'study',
        recordType: studyType,
        records: records,
    });*/
    ///////////////////////

    var {
        records,
        recordsCount,
        related,
        displayFieldData,
    } = await extendedSearch.core({
        db,
        collection: 'study',
        recordType: studyType,

        columns,
        sort,
        offset,
        limit,

        customFilters,
        specialFilterConditions: (
            extendedSearch.study.createSpecialFilterConditions(specialFilters)
        ),
    });

    context.body = ResponseBody({
        data: {
            records,
            recordsCount,
            related,
            displayFieldData,
            //displayFieldData: availableDisplayFieldData,
        },
    });
}

/*var createSpecialFilterConditions = (filters) => {
    var {
        studyId,
    } = filters;

    var AND = [];
    if (studyId) {
        AND.push({
            '_id': new RegExp(escapeRX(studyId), 'i')
        });
    }

    var statics = createCustomQueryValues({
        fields: [
            {
                key: 'name',
                pointer: '/state/name',
                type: 'SaneString'
            },
            {
                key: 'shorthand',
                pointer: '/state/shorthand',
                type: 'SaneString'
            },
            {
                key: 'scientistIds',
                pointer: '/state/scientistIds',
                type: 'ForeignIdList',
                props: { collection: 'personnel' }
            },
            {
                key: 'studyTopicIds',
                pointer: '/state/studyTopicIds',
                type: 'ForeignIdList',
                props: { collection: 'studyTopic' }
            },
            {
                key: 'researchGroupIds',
                pointer: '/state/researchGroupIds',
                type: 'ForeignIdList',
                props: { collection: 'researchGroup' }
            }
        ],
        filters,
    });
    if (Object.keys(statics).length > 0 ) {
        AND.push(convertPointerKeys(statics));
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
}*/

module.exports = studyExtendedSearch;

