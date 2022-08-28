'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:readSubjectTestability'
);

var jsonpointer = require('jsonpointer');
var intervalfns = require('@mpieva/psydb-interval-fns');

var {
    convertCRTRecordToSettings,
    findCRTAgeFrameField,
    calculateTestableIntervals,
} = require('@mpieva/psydb-common-lib');


var {
    ResponseBody,
    validateOrThrow,
    fetchOneCustomRecordType,
} = require('@mpieva/psydb-api-lib');

var {
    AddSubjectTestabilityFieldsStage,
    HasAnyTestabilityStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    ForeignIdList,
    DateTimeInterval,
    Timezone,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        subjectIds: ForeignIdList({ collection: 'subject' }),
        studyId: ForeignId({ collection: 'study' }),
        labProcedureTypeKey: { type: 'string' }, // FIXME
        desiredTestInterval: DateTimeInterval(),
        //ageFrameFilters 
    },
    required: [
        'subjectIds',
        'studyId',
        'labProcedureTypeKey',
    ]
});

var readSubjectTestability = async (context, next) => {
    var { db, request } = context;
    
    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    // FIXME
    var fallbackDesiredTestInterval = {
        start: new Date('1900-01-01T00:00:00.000Z'),
        end: new Date('3000-01-01T00:00:00.000Z')
    };

    var {
        subjectIds,
        studyId,
        labProcedureTypeKey,
        desiredTestInterval = fallbackDesiredTestInterval,
    } = request.body;

    var study = await (
        db.collection('study').findOne({ _id: studyId })
    );

    // FIXME: can break if multiple subject types are selected
    var { type: subjectTypeKey } = await (
        db.collection('subject').findOne(
            { _id: { $in: subjectIds } },
            { projection: { type: true }}
        )
    );
    
    var subjectCRT = await fetchOneCustomRecordType({
        db,
        collection: 'subject',
        type: subjectTypeKey,
    });

    var { ageFrameFilters, ageFrameValueFilters } = await initAgeFrames({
        db, subjectTypeKey, studyId,
    });

    var testableSubjects = await (
        db.collection('subject')
        .aggregate([
            { $match: { _id: { $in: subjectIds }}},
            AddSubjectTestabilityFieldsStage({
                // FIXME: we need to rework this 
                // to be usable w/o theese paramsa
                // NOTE: experimentVariant is used to
                // determine test permissions
                experimentVariant: labProcedureTypeKey,
                interval: desiredTestInterval,
                //
                ageFrameFilters,
                ageFrameValueFilters,

                subjectTypeKey,
                subjectTypeRecord: subjectCRT,
                studyRecords: [ study ],

                // TODO: global study settings filters in stage itself
            }),
            HasAnyTestabilityStage({
                studyIds: [ studyId ]
            }),
        ])
        .toArray()
    );

    // intervals where all subjects are testable together
    var testableIntervals = undefined;
    if (testableSubjects.length > 0) {
        for (var subject of testableSubjects) {

            var subjectCRTSettings = convertCRTRecordToSettings(subjectCRT);
            var dobFieldPointer = findCRTAgeFrameField(subjectCRTSettings);
            var dateOfBirth = jsonpointer.get(subject, dobFieldPointer);

            var testableIntervalsForSubject = calculateTestableIntervals({
                dateOfBirth,
                ageFrameIntervals: ageFrameFilters.map(it => it.interval)
            });

            if (testableIntervals) {
                intervalfns.intersect({
                    setA: testableIntervals,
                    setB: testableIntervalsForSubject,
                })
            }
            else {
                testableIntervals = testableIntervalsForSubject;
            }
        }
    } 

    context.body = ResponseBody({
        data: {
            testableIntervals
        },
    });

    await next();
}

var initAgeFrames = async ({
    db,
    subjectTypeKey,
    studyId
}) => {

    var ageFrameRecords = await (
        db.collection('ageFrame').aggregate([
            { $match: {
                studyId,
                subjectTypeKey,
            }},
        ]).toArray()
    );

    var unwoundAgeFrameRecords = await (
        db.collection('ageFrame').aggregate([
            { $match: {
                studyId,
                subjectTypeKey,
            }},
            { $unwind: '$state.conditions' },
            { $unwind: '$state.conditions.values' },
        ]).toArray()
    );

    return {
        ageFrameFilters: ageFrameRecords.map(it => ({
            ageFrameId: it._id,
            studyId: it.studyId,
            interval: it.state.interval,
        })),
        ageFrameValueFilters: unwoundAgeFrameRecords.map(it => ({
            ageFrameId: it._id,
            studyId: it.studyId,
            interval: it.state.interval,
            pointer: it.state.conditions.pointer,
            value: it.state.conditions.values
        }))
    };
}

module.exports = readSubjectTestability;
