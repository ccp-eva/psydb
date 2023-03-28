'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:participatedSubjectsForStudy'
);

var {
    keyBy,
    compareIds,
    ejson,
} = require('@mpieva/psydb-core-utils');

var {
    gatherSubjectTypesFromLabProcedureSettings
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    ResponseBody,

    validateOrThrow,
    verifyStudyAccess,

    createRecordLabel,
    fetchRecordById,
    createSchemaForRecordType,
    fetchRelatedLabelsForMany,
    gatherDisplayFieldsForRecordType,
    fetchOneCustomRecordType,
    applyRecordLabels,
} = require('@mpieva/psydb-api-lib');

var {
    ProjectDisplayFieldsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        studyId: ForeignId({ collection: 'study' }),
        onlyParticipated: DefaultBool(),
        sort: ExactObject({
            properties: {
                path: {
                    type: 'string',
                    minLength: 1,
                },
                direction: {
                    type: 'string',
                    enum: [ 'asc', 'desc' ]
                }
            },
            required: [ 'path', 'direction' ]
        }),
    },
    required: [
        'studyId',
    ]
});

var participatedSubjectsForStudy = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    })

    var {
        studyId,
        onlyParticipated,
        sort,
    } = request.body;

    await verifyStudyAccess({
        db,
        permissions,
        studyId,
        action: 'read',
        additionalFlags: [ 'canReadParticipation' ]
    });

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId,
            }},
            { $project: { _id: true, 'state.subjectTypeKey': true }},
        ]).toArray()
    );
    if (settingRecords.length < 1) {
        throw new ApiError(400, 'StudyHasNoLabProcedureSettings');
    }

    var subjectTypeKeys = gatherSubjectTypesFromLabProcedureSettings({
        settingRecords
    });

    var dataBySubjectType = {};
    for (var subjectType of subjectTypeKeys) {
        var data = await fetchParticipation({
            db,
            subjectType,
            studyId,
            onlyParticipated,
            sort,
        });

        dataBySubjectType[subjectType] = data;
    }

    //console.log(dataBySubjectType);

    context.body = ResponseBody({
        data: {
            dataBySubjectType,
        },
    });

    await next();
};

var fetchParticipation = async ({
    db,
    subjectType,
    studyId,
    onlyParticipated,
    sort,
}) => {

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'subject',
        customRecordType: subjectType
    });

    var subjectRecords = await (
        db.collection('subject').aggregate([
            { $unwind: '$scientific.state.internals.participatedInStudies' },
            { $match: {
                'type': subjectType,
                'scientific.state.internals.participatedInStudies.studyId': studyId,
                ...(onlyParticipated && {
                    'scientific.state.internals.participatedInStudies.status': 'participated'
                })
            }},
            StripEventsStage({
                subChannels: [ 'scientific', 'gdpr' ]
            }),
            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    'type': true,
                    'scientific.state.internals.participatedInStudies': true 
                }
            }),
            ...(sort ? [{ $sort: {
                [sort.path]: sort.direction === 'desc' ? -1 : 1
            }}] : [])
        ]).toArray()
    );

    //throw new Error();
    
    // FIXME: mongodb can do this
    // required for our schema inversion to work
    subjectRecords.forEach(it => {
        it.scientific.state.internals.participatedInStudies = [
            it.scientific.state.internals.participatedInStudies
        ];
    })

    var recordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'subject',
        recordType: subjectType,
        fullSchema: true
    });

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        records: subjectRecords
    })

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))

    var subjectTypeRecord = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectType,
    });

    applyRecordLabels({
        records: subjectRecords,
        customRecordType: subjectTypeRecord
    });

    return ({
        records: subjectRecords,
        relatedRecordLabels: relatedRecords,
        relatedHelperSetItems: relatedHelperSetItems,
        relatedCustomRecordTypeLabels: relatedCustomRecordTypes,
        displayFieldData,
    })
}

module.exports = participatedSubjectsForStudy;
