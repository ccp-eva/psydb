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
    CRTSettings,
    checkLabOperationAccess
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    ResponseBody,

    withRetracedErrors,
    aggregateToArray,
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

    var canAccessInhouse = checkLabOperationAccess({
        researchGroupId,
        labOperationType: 'inhouse',
        flag: 'canConfirmSubjectInvitation',
        permissions,
    });

    var canAccessOnlineVideoCall = checkLabOperationAccess({
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

    var studyRecords = await withRetracedErrors(
        aggregateToArray({ db, study: [
            { $match: {
                'state.researchGroupIds': researchGroupId,
            }},
            MatchIntervalAroundStage({
                start, end,
                recordIntervalPath: 'state.runningPeriod',
                recordIntervalEndCanBeNull: true
            }),
        ]})
    );
    
    var experimentRecords = await withRetracedErrors(
        aggregateToArray({ db, experiment: [
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                'type': { $in: experimentTypes },
                'state.studyId': { $in: studyRecords.map(it => it._id) },
                // TODO: only for invitation
                'state.subjectData.invitationStatus': 'scheduled',
            }},
            StripEventsStage(),
        ]})
    );

    var subjectIds = [];
    for (var it of experimentRecords) {
        subjectIds = [
            ...subjectIds,
            ...(it.state.subjectData.map(it => it.subjectId))
        ]
    }

    //console.log(subjectIds);

    var subjectCRTRecord = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectRecordType,
    });
    var subjectCRT = CRTSettings.fromRecord(subjectCRTRecord);

    var displayFieldData = subjectCRT.augmentedDisplayFields('table');

    //var {
    //    displayFields,
    //    availableDisplayFieldData,
    //} = await gatherDisplayFieldsForRecordType({
    //    prefetched: subjectCRTRecord,
    //    permissions,
    //});

    // TODO make seperate display field list for invite confirmation
    var [ phoneField ] = (
        subjectCRT.findCustomFields({
            'systemType': { $in: [
                'Phone', 'PhoneList', 'PhoneWithTypeList'
            ]}
        })
    );


    var subjectRecords = await withRetracedErrors(
        aggregateToArray({ db, subject: [
            { $match: {
                _id: { $in: subjectIds }
            }},
            StripEventsStage({ subChannels: ['gdpr', 'scientific' ]}),

            ProjectDisplayFieldsStage({
                displayFields: displayFieldData,
                additionalProjection: phoneField ? {
                    [convertPointerToPath(phoneField.pointer)]: true
                } : {}
            }),
        ]})
    );

    var subjectRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        records: subjectRecords
    })

    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: experimentRecords
    })

    //console.dir(subjectRelated, { depth: null });

    //console.log(experimentRecords);

    var experimentOperatorTeamRecords = await withRetracedErrors(
        aggregateToArray({ db, experimentOperatorTeam: [
            { $match: {
                _id: { $in: experimentRecords.map(it => (
                    it.state.experimentOperatorTeamId
                ))},
            }},
            StripEventsStage(),
        ]})
    );

    var subjectRecordsById = keyBy({
        items: subjectRecords,
        byProp: '_id'
    })

    var experimentStudyRecords = await (
        db.collection('study').aggregate([
            { $match: {
                _id: { $in: (
                    experimentRecords.map(it => it.state.studyId)
                )},
            }},
        ]).toArray()
    );

    context.body = ResponseBody({
        data: {
            experimentRecords,
            experimentOperatorTeamRecords,
            experimentRelated,
            subjectRecordsById,
            subjectRelated,
            subjectDisplayFieldData: displayFieldData,
            phoneField,
            studyRecords: experimentStudyRecords,
        },
    });

    await next();
}


module.exports = inviteConfirmationList;
