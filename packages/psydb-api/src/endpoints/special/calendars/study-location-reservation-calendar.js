'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:reservationCalendar'
);

var jsonpointer = require('jsonpointer');
var { compareIds, keyBy } = require('@mpieva/psydb-core-utils');
var { countExperimentSubjects } = require('@mpieva/psydb-common-utils');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    StripEventsStage
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');
var fetchRecordsInInterval = require('@mpieva/psydb-api-lib/src/fetch-records-in-interval');
var fetchEnabledLocationRecordsForStudy = require('@mpieva/psydb-api-lib/src/fetch-enabled-location-records-for-study');


var {
    ExactObject,
    Id,
    IdentifierString,
    DateTime,
    ForeignId,
    ExperimentTypeEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        experimentType: ExperimentTypeEnum(),
        studyId: Id(),
        locationRecordType: IdentifierString(),
        start: DateTime(),
        end: DateTime(),
        selectedSubjectId: ForeignId({ collection: 'subject' })
    },
    required: [
        //'experimentType', NOTE: cant require this bc of reservation
        'studyId',
        'locationRecordType',
        'start',
        'end'
    ]
})

var studyLocationReservationCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        request
    } = context;

    var ajv = Ajv();
    var isValid = ajv.validate(RequestBodySchema(), request.body);
    if (!isValid) {
        debug('ajv errors', ajv.errors);
        throw new ApiError(400, {
            apiStatus: 'InvalidParams',
            data: { ajvErrors: ajv.errors }
        });
    }

    var {
        experimentType,
        studyId,
        locationRecordType: locationType,
        start,
        end,
        selectedSubjectId,
    } = request.body;

    var studyRecord = await fetchRecordById({
        db,
        collectionName: 'study',
        id: studyId,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!studyRecord) {
        throw new ApiError(404, 'NoAccessibleStudyRecordFound');
    }

    var selectedSubjectRecord = undefined;
    if (selectedSubjectId) {
        selectedSubjectRecord = await (
            db.collection('subject').findOne({
                _id: selectedSubjectId,
            }, { projection: { events: false }})
        );
        if (!selectedSubjectRecord) {
            throw new ApiError(404, 'InvalidSubjectId');
        }
    }

    var locationRecords = await fetchEnabledLocationRecordsForStudy({
        db, studyId, locationType
    });

    var reservationRecords = await fetchRecordsInInterval({
        db,
        collection: 'reservation',
        start,
        end,
        additionalStages: [
            { $match: { type: { $in: [ 'inhouse', 'online-video-call' ] }}}
        ]
    });

    reservationRecords = stripIfOtherStudy({
        records: reservationRecords,
        studyId,
    });

    var experimentRecords = await fetchRecordsInInterval({
        db,
        collection: 'experiment',
        start,
        end,
        additionalStages: [
            { $match: {
                type: { $in: [ 'inhouse', 'online-video-call' ] },
                'state.isCanceled': false,
            }}
        ]
    });
    
    experimentRecords = stripIfOtherStudy({
        records: experimentRecords,
        studyId,
    });

    if (selectedSubjectRecord) {
        var allSubjectIds = experimentRecords.reduce((acc, record) => [
            ...acc,
            ...(
                record.state.subjectData
                .filter(sd => sd.subjectType === selectedSubjectRecord.type)
                .map(sd => sd.subjectId)
            )
        ], []);

        var allSubjectRecords = await (
            db.collection('subject').aggregate([
                { $match: {
                    _id: { $in: allSubjectIds }
                }},
                StripEventsStage({ subChannels: [ 'scientific', 'gdpr' ]}),
            ]).toArray()
        );

        if (!experimentType) {
            throw new ApiError(400, 'MissingExperimentType');
        }

        var settingRecord = await (
            db.collection('experimentVariantSetting').findOne({
                studyId,
                type: experimentType,
                'state.subjectTypeKey': selectedSubjectRecord.type,
            }, { projecton: { events: false }})
        );

        experimentRecords = augmentWithSelectSubjectMetadata({
            experimentRecords,
            settingRecord,
            selectedSubjectRecord,
            allSubjectRecords,
        })
    }

    context.body = ResponseBody({
        data: {
            locationRecords,
            reservationRecords,
            experimentRecords,
        }
    });

    await next();
}

var stripIfOtherStudy = ({
    records,
    studyId,
}) => (
    records.map(
        ({ _id, state, ...other }) => (
            compareIds(state.studyId, studyId)
            ? { _id, state, ...other }
            : {
                _id,
                state: {
                    locationId: state.locationId,
                    interval: state.interval
                },
                ...other
            }
        )
    )
);

var augmentWithSelectSubjectMetadata = (options) => {
    var {
        experimentRecords,
        settingRecord,
        selectedSubjectRecord,
        allSubjectRecords,
    } = options;

    var {
        subjectsPerExperiment,
        subjectFieldRequirements,
    } = settingRecord.state;

    var subjectsById = keyBy({
        items: allSubjectRecords,
        byProp: '_id',
    });

    for (var exp of experimentRecords) {
        var count = countExperimentSubjects({
            experimentRecord: exp,
            subjectTypeKey: selectedSubjectRecord.type,
        });
        
        exp._missingSubjectCount = subjectsPerExperiment - count;
        
        var requirementValues = {};
        for (var sd of exp.state.subjectData) {
            var subject = subjectsById[sd.subjectId];
            for (var req of subjectFieldRequirements) {
                var { pointer } = req;

                var value = jsonpointer.get(subject, pointer);
                if (!requirementValues[pointer]) {
                    requirementValues[pointer] = [];
                }
                requirementValues[pointer].push(value);
            }
        }

        var invalidRequirements = [];
        for (var req of subjectFieldRequirements) {
            var { pointer, check } = req;
            var newValue = jsonpointer.get(selectedSubjectRecord, pointer);
            var existingValues = requirementValues[pointer];
            if (check === 'inter-subject-equality') {
                if (!existingValues.includes(newValue)) {
                    invalidRequirements.push({
                        ...req,
                        newValue,
                        existingValues,
                    });
                }
            }
        }

        exp._matchesRequirements = (
            invalidRequirements.length === 0
            ? true
            : false
        );
        exp._isAugmented = true;
    }

    return experimentRecords;
}
module.exports = studyLocationReservationCalendar;

