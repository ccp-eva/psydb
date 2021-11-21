'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:invitedInhouseSubjects'
);

var {
    validateOrThrow,
    ApiError,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

var {
    groupBy,
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var convertPointerToPath = require('@mpieva/psydb-api-lib/src/convert-pointer-to-path');

var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');

var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var {
    MatchIntervalOverlapStage,
    MatchIntervalAroundStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var inviteConfirmationList = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    // TODO: check schema

    // FIXME: maybe unmarshal researchGroupId
    // FIXME: we should maybe add subjectRecordtype and studyRecordType
    var {
        researchGroupId,
        subjectRecordType,
        start,
        end,
    } = request.body;

    // TODO: unmarshal date
    start = new Date(start);
    end = new Date(end);
    
    // TODO permissions
    if (!permissions.hasRootAccess) {
        var allowed = permissions.allowedResearchGroupIds.find(id => {
            return compareIds(id, researchGroupId)
        })
        if (!allowed) {
            throw new ApiError(403)
        }
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
                type: { $in: [ 'inhouse', 'online-video-call' ] },
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
