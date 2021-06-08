'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:inhouseExperimentCalendar'
);

var Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var convertPointerToPath = require('@mpieva/psydb-api-lib/src/convert-pointer-to-path');

var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');

var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    CustomRecordTypeKey,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        //researchGroupId: ForeignId({ collection: 'researchGroup' }),
        subjectRecordType: CustomRecordTypeKey({ collection: 'subject' }),
        interval: DateTimeInterval(),
        studyId: ForeignId({ collection: 'study' }),
        experimentType: {
            type: 'string',
            enum: ['inhouse', 'away-team'],
        }
    },
    required: [
        //'researchGroupId',
        'subjectRecordType',
        'interval',
        'experimentType',
    ]
})

var experimentCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var ajv = Ajv(),
        isValid = false;

    isValid = ajv.validate(
        RequestBodySchema(),
        request.body
    );
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, 'InvalidRequestSchema');
    };


    var {
        subjectRecordType,
        interval,
        studyId,
        experimentType,
    } = request.body;

    var { start, end } = interval;

    if (!permissions.hasRootAccess) {
        var allowed = permissions.allowedResearchGroupIds.find(id => {
            return compareIds(id, researchGroupId)
        })
        if (!allowed) {
            throw new ApiError(403)
        }
    }

    var studyRecords = []
    if (studyId) {
        studyRecords = await (
            db.collection('study').find({
                _id: studyId,
            }).toArray()
        );
    }
    else {
        studyRecords = await (
            db.collection('study').aggregate([
                ...SystemPermissionStages({ permissions }),
                { $match: {
                    $or: [
                        {
                            'state.runningPeriod.start': { $lte: start },
                            'state.runningPeriod.end': { $gte: start }
                        },
                        {
                            'state.runningPeriod.start': { $lte: end },
                            'state.runningPeriod.end': { $gte: end },
                        },
                        {
                            'state.runningPeriod.start': { $lte: end },
                            'state.runningPeriod.end': { $exists: false },
                        }
                    ]
                }},
            ]).toArray()
        );
    }

    var studyIds = studyRecords.map(it => it._id);
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                type: experimentType,
                'state.studyId': { $in: studyIds }
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


module.exports = experimentCalendar;
