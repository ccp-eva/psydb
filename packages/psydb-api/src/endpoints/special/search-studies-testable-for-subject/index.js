'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchStudiesTestableForSubject'
);

var jsonpointer = require('jsonpointer');
var { groupBy } = require('@mpieva/psydb-core-utils');
var intervalfns = require('@mpieva/psydb-interval-fns');

var {
    convertCRTRecordToSettings,
    findCRTAgeFrameField,
    calculateTestableIntervals,
} = require('@mpieva/psydb-common-lib');

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalAroundStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
    DateTimeInterval,
    Timezone,
} = require('@mpieva/psydb-schema-fields');

var fetchExcludedStudiesForSubject = require('./fetch-excluded-studies-for-subject');

var RequestBodySchema = () => ExactObject({
    properties: {
        subjectId: ForeignId({ collection: 'subject' }),
        desiredTestInterval: DateTimeInterval(),
    },
    required: [
        'subjectId',
    ]
});

var searchStudiesTestableForSubject = async (context, next) => {
    var { db, request, permissions } = context;
    
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
        subjectId,
        desiredTestInterval = fallbackDesiredTestInterval,
    } = request.body;

    var subjectRecord = await (
        db.collection('subject').findOne({ _id: subjectId })
    );

    var subjectCRTSettings = await fetchCRTSettings({
        db,
        collectionName: 'subject',
        recordType: subjectRecord.type,
    });

    var testingPermissions = gatherIntersectedTestingPermissions(
        subjectRecord,
        permissions
    );

    if (testingPermissions.length < 1) {
        throw new ApiError(403, { apiStatus: 'LabOperationAccessDenied' })
    }

    var studyExclusion = await fetchExcludedStudiesForSubject({
        db, subjectRecord
    });
    console.log(studyExclusion);

    var now = new Date();
    var studyRecords = await (
        db.collection('study').aggregate([
            MatchIntervalAroundStage({
                recordIntervalPath: 'state.runningPeriod',
                recordIntervalEndCanBeNull: true,
                start: now,
                end: now,
            }),
            ...SystemPermissionStages({
                collection: 'study',
                permissions
            }),
            { $project: {
                'type': true,
                'state.name': true,
                'state.shorthand': true,
                'state.enableFolloeUpExperiments': true,
            }},
            { $sort: {
                'state.shorthand': 1,
                'state.name': 1
            }},
        ], {
            collation: { locale: 'de@collation=phonebook' }
        }).toArray()
    );

    var { ageFrameFilters, ageFrameValueFilters } = await initAgeFrames({
        db,
        subjectTypeKey: subjectRecord.type,
        studyIds: studyRecords.map(it => it._id),
    });

    //console.log({
    //    studyIds: studyRecords.map(it => it._id),
    //    ageFrameFilters
    //})

    var testableIntervalsByStudyId = calculateAllTestableIntervals({
        subjectCRTSettings,
        subjectRecord,
        ageFrameFilters,
        ageFrameValueFilters,
        desiredTestInterval,
    });
    
    var testableStudies = [];
    for (var study of studyRecords) {
        var testableIntervals = testableIntervalsByStudyId[study._id];

        if (testableIntervals) {
            testableStudies.push({
                ...study,
                _testableIntervals: testableIntervals,
            });
        }
    }

    var possibleProceduresByStudyId = await fetchPossibleProcedureKeys({
        db,
        studyIds: testableStudies.map(it => it._id),
        subjectType: subjectRecord.type
    });
    testableStudies = (
        testableStudies
        .map(it => ({
            ...it,
            _possibleProcedures: possibleProceduresByStudyId[it._id]
        }))
        .filter(it => it._possibleProcedures)
    );
    //console.log(testableStudies);

    context.body = ResponseBody({
        data: testableStudies
    });

    await next();
}

var initAgeFrames = async ({
    db,
    subjectTypeKey,
    studyIds
}) => {

    var ageFrameRecords = await (
        db.collection('ageFrame').aggregate([
            { $match: {
                studyId: { $in: studyIds },
                subjectTypeKey,
            }},
        ]).toArray()
    );

    var unwoundAgeFrameRecords = await (
        db.collection('ageFrame').aggregate([
            { $match: {
                studyId: { $in: studyIds },
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

var gatherIntersectedTestingPermissions = (
    subjectRecord, userPermissions
) => {
    var { testingPermissions } = subjectRecord.scientific.state;

    var out = [];
    for (var it of testingPermissions) {
        var { researchGroupId, permissionList } = it;
        permissionList = permissionList.filter((it) => (
            it.value === 'yes'
            && userPermissions.hasLabOperationFlag(
                it.labProcedureTypeKey,
                'canSelectSubjectsForExperiments'
            )
        ));
        if (permissionList.length > 0) {
            out.push({
                researchGroupId,
                permissionList
            })
        }
    }
    return out;
}

var calculateAllTestableIntervals = (bag) => {
    var {
        subjectCRTSettings,
        subjectRecord,
        ageFrameFilters,
        ageFrameValueFilters,
        desiredTestInterval,
    } = bag;

    var groupedAFValueFilters = groupBy({
        items: ageFrameValueFilters || [],
        byProp: 'ageFrameId',
    })
    
    var out = {};
    for (var af of ageFrameFilters) {
        var { ageFrameId, studyId, interval } = af;
        
        var valueFilters = groupedAFValueFilters[ageFrameId] || [];

        var hasAnyExpectedValue = false;
        if (valueFilters.length > 0) {
            for (var vf of valueFilters) {
                var { pointer, value } = vf;
                var hasExpectedValue = (
                    jsonpointer.get(subjectRecord, pointer) === value
                )
                if (hasExpectedValue) {
                    hasAnyExpectedValue = true;
                    break;
                }
            }
        }
        else {
            hasAnyExpectedValue = true;
        }

        if (!hasAnyExpectedValue) {
            continue;
        }

        var dobFieldPointer = findCRTAgeFrameField(subjectCRTSettings);
        var dateOfBirth = jsonpointer.get(subjectRecord, dobFieldPointer);

        var testableIntervals = calculateTestableIntervals({
            dateOfBirth,
            ageFrameIntervals: [ interval ]
        });

        testableIntervals = intervalfns.intersect({
            setA: testableIntervals,
            setB: [ desiredTestInterval ]
        });

        if (testableIntervals.length > 0) {
            if (!out[studyId]) {
                out[studyId] = [];
            }

            out[studyId] = [
                ...out[studyId],
                ...testableIntervals
            ]
        }
    }

    //console.log(out);
    return out;
}

var fetchPossibleProcedureKeys = async (bag) => {
    var { db, studyIds, subjectType } = bag;
    
    var settings = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                type: { $in: [ 'inhouse', 'online-video-call' ]}, // FIXME: later we will allow also allow away-team
                studyId: { $in: studyIds },
                'state.subjectTypeKey': subjectType,
            }},
            { $project: {
                'studyId': true,
                'type': true
            }}
        ]).toArray()
    );

    var out = {};
    for (var it of settings) {
        if (!out[it.studyId]) {
            out[it.studyId] = [];
        }
        out[it.studyId].push(it.type);
    }
    return out;
} 

module.exports = searchStudiesTestableForSubject;
