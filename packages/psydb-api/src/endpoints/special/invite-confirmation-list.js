'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:invitedInhouseSubjects'
);

var {
    groupBy,
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    checkLabOperationAccess
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    ResponseBody,

    validateOrThrow,

    convertPointerToPath,
    fetchOneCustomRecordType,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalOverlapStage,
    MatchIntervalAroundStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    CustomRecordTypeKey,
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        subjectRecordType: CustomRecordTypeKey({ collection: 'subject' }),
        start: DateTime(),
        end: DateTime(),
    },
    required: [
        'researchGroupId',
        'subjectRecordType',
        'start',
        'end',
    ]
});

var inviteConfirmationList = async (context, next) => {
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
        researchGroupId,
        subjectRecordType,
        start,
        end,
    } = request.body;

    var canAccessInhouse = checkLabOperationFlag({
        researchGroupId,
        labOperationType: 'inhouse',
        flag: 'canConfirmSubjectInvitation',
        permissions,
    })

    var canAccessOnlineVideoCall = checkLabOperationFlag({
        researchGroupId,
        labOperationType: 'online-video-call',
        flag: 'canConfirmSubjectInvitation',
        permissions,
    });

    if (!canAccessInhouse && !canAccessOnlineVideoCall) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                researchGroupId,
                flag: 'canConfirmSubjectInvitation',
                labOperationTypes: [ 'online-video-call', 'inhouse' ]
            }
        })
    }

    var experimentTypes = [];
    if (canAccessInhouse) {
        experimentTypes.push('inhouse');
    }
    if (canAccessOnlineVideoCall) {
        experimentTypes.push('online-video-call');
    }

    var studyRecords = await (
        db.collection('study').aggregate([
            { $match: {
                'state.researchGroupIds': researchGroupId,
            }},
            MatchIntervalAroundStage({
                start, end,
                recordIntervalPath: 'state.runningPeriod',
                recordIntervalEndCanBeNull: true
            }),
        ]).toArray()
    );
    
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                type: { $in: experimentTypes },
                // TODO: only for invitation
                'state.subjectData.invitationStatus': 'scheduled',
            }},
            StripEventsStage(),
        ]).toArray()
    );

    var subjectIds = [];
    for (var it of experimentRecords) {
        subjectIds = [
            ...subjectIds,
            ...(
                it.state.subjectData
                .filter(it => it.invitationStatus === 'scheduled')
                .map(it => it.subjectId)
            )
        ]
    }

    //console.log(subjectIds);

    var subjectRecordTypeData = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectRecordType,
    });

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        prefetched: subjectRecordTypeData,
    });

    // TODO: theese fields needs a flag of some kind so that they are allowed
    // to be shown here
    // find the first PhoneList field
    var phoneListField = (
        subjectRecordTypeData.state.settings.subChannelFields.gdpr
        .find(field => {
            return (field.type === 'PhoneList');
        })
    );

    var subjectRecords = await (
        db.collection('subject').aggregate([
            { $match: {
                _id: { $in: subjectIds }
            }},
            StripEventsStage({ subChannels: ['gdpr', 'scientific' ]}),

            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    [`gdpr.state.custom.${phoneListField.key}`]: true,
                    //'scientific.state.internals.invitedForExperiments': true,
                }
            }),
        ]).toArray()
    );

    var subjectRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        recordType: subjectRecordType,
        records: subjectRecords
    })

    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: experimentRecords
    })

    //console.dir(subjectRelated, { depth: null });

    //console.log(experimentRecords);

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                _id: { $in: experimentRecords.map(it => (
                    it.state.experimentOperatorTeamId
                ))},
            }},
            StripEventsStage(),
        ]).toArray()
    );

    var subjectRecordsById = keyBy({
        items: subjectRecords,
        byProp: '_id'
    })

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))


    context.body = ResponseBody({
        data: {
            experimentRecords,
            experimentOperatorTeamRecords,
            experimentRelated,
            subjectRecordsById,
            subjectRelated,
            subjectDisplayFieldData: displayFieldData,
            phoneListField,
        },
    });

    await next();
}


module.exports = inviteConfirmationList;
