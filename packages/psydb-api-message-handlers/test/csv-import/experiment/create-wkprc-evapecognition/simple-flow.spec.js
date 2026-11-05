'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var COLLECTIONS = [
    'csvImport',
    'experiment',
    'subject',
    'subjectGroup',
    'sequenceNumbers',
];

var tprefix = require('./t-prefix');
describe(`${tprefix} simple-flow`, function () {
    var db, ids, send, deltas;
    var chimpanzeeG1Id;

    before(async function () {
        ids = await this.restore([ 'wkprc-stub-2026-10-08' ], {
            gatherIds: true
        });

        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

        db = this.getDbHandle();

        deltas = BaselineDeltas.Multi(COLLECTIONS);
        deltas.update = async () => {
            deltas.push(await this.aggregateAll(COLLECTIONS));
        }

        await deltas.update();

        // NOTE: chimpanzees and bonobos both have a group "G1"
        // at Chimfushi Sanctuary, so ids('G1') would be ambiguous
        ({ _id: chimpanzeeG1Id } = deltas.subjectGroup.getCurrent_RAW().find(
            it => it.subjectType === 'wkprc_chimpanzee' && it.state.name === 'G1'
        ));
    });

    step('create simple', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/simple'
        )});

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: {
                studyId: ids('WKPRC Test Study'),
                subjectType: 'wkprc_chimpanzee',
                fileId: file._id,
                skipPossibleDuplicates: false,
            }
        }));

        await deltas.update();

        // NOTE: the trailing empty csv line is ignored
        deltas.csvImport.test({ expected: {
            '/0': ExpectedCSVImport({
                csvImportId, fileId: file._id,
                studyId: ids('WKPRC Test Study'),
                createdBy: ids(/ROOT/),
                skipPossibleDuplicates: false,
                rows: [
                    { isRefReplacementOk: true, errorColumns: [] },
                    // NOTE: exact duplicate of the first line
                    { isRefReplacementOk: true, errorColumns: [] },
                    // NOTE: with an unknown location "G1" is ambiguous
                    { isRefReplacementOk: false, errorColumns: [
                        'locationId', 'subjectGroupId'
                    ]},
                    { isRefReplacementOk: false, errorColumns: [
                        'subjectData[0].subjectId'
                    ]},
                    { isRefReplacementOk: true, errorColumns: [] },
                ]
            }),
        }});

        // NOTE: lines with errors are skipped, the duplicate first
        // two lines result in a single experiment
        var [ choiceAll, choiceOther ] = deltas.experiment.getCurrent_RAW();
        var common = {
            csvImportId,
            studyId: ids('WKPRC Test Study'),
            locationId: ids('Chimfushi Sanctuary'),
            subjectGroupId: chimpanzeeG1Id,
            experimentOperatorId: ids(/ROOT/),
            // NOTE: csv only has the date; stored as noon Europe/Berlin
            timestamp: '2024-10-30T11:00:00.000Z',
        };

        deltas.experiment.test({ expected: {
            '0': ExpectedExperiment({
                ...common, conditionName: 'all', subjects: [
                    { subjectId: ids(/^Jaro /), role: 'focus',
                        comment: 'some comment' },
                    { subjectId: ids(/^Star /), role: 'stooge',
                        comment: '' },
                ]
            }),
            '1': ExpectedExperiment({
                ...common, conditionName: 'other', subjects: [
                    { subjectId: ids(/^Jaro /), role: 'focus',
                        comment: 'some comment' },
                ]
            }),
        }, asFlatEJSON: true });

        deltas.subject.test({ expected: {
            // Jaro
            '0': { 'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/internals/participatedInStudies': [
                    ExpectedParticipation({
                        ...common, experimentId: choiceAll._id,
                        conditionName: 'all', role: 'focus',
                        totalSubjectCount: 2,
                    }),
                    ExpectedParticipation({
                        ...common, experimentId: choiceOther._id,
                        conditionName: 'other', role: 'focus',
                        totalSubjectCount: 1,
                    }),
                ],
            }},
            // Star
            '1': { 'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/internals/participatedInStudies': [
                    ExpectedParticipation({
                        ...common, experimentId: choiceAll._id,
                        conditionName: 'all', role: 'stooge',
                        totalSubjectCount: 2,
                    }),
                ],
            }},
        }, asFlatEJSON: true });

        deltas.subjectGroup.test({ expected: {}});
        deltas.sequenceNumbers.test({ expected: {}});
    });

    step('create simple w/ skipped duplicates', async function () {
        var file = await this.createFakeFileUpload({ db, buffer: loadCSV(
            'experiment-csv/simple-step2'
        )});

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: {
                studyId: ids('WKPRC Test Study'),
                subjectType: 'wkprc_chimpanzee',
                fileId: file._id,
                skipPossibleDuplicates: true,
            }
        }));

        await deltas.update();

        // NOTE: skipped duplicates are not marked in the pipeline data
        deltas.csvImport.test({ expected: {
            '/1': ExpectedCSVImport({
                csvImportId, fileId: file._id,
                studyId: ids('WKPRC Test Study'),
                createdBy: ids(/ROOT/),
                skipPossibleDuplicates: true,
                rows: [
                    { isRefReplacementOk: true, errorColumns: [] },
                    { isRefReplacementOk: true, errorColumns: [] },
                    { isRefReplacementOk: false, errorColumns: [
                        'locationId', 'subjectGroupId'
                    ]},
                    { isRefReplacementOk: false, errorColumns: [
                        'subjectData[0].subjectId'
                    ]},
                    { isRefReplacementOk: true, errorColumns: [] },
                    // NOTE: the only new line
                    { isRefReplacementOk: true, errorColumns: [] },
                ]
            }),
        }});

        // NOTE: only the new line results in an experiment, everything
        // else is a duplicate of what was imported in the step before
        var [ ,, newOne ] = deltas.experiment.getCurrent_RAW();
        var common = {
            csvImportId,
            studyId: ids('WKPRC Test Study'),
            locationId: ids('Chimfushi Sanctuary'),
            subjectGroupId: chimpanzeeG1Id,
            experimentOperatorId: ids(/ROOT/),
            timestamp: '2024-11-01T11:00:00.000Z',
        };

        deltas.experiment.test({ expected: {
            '2': ExpectedExperiment({
                ...common, conditionName: 'other', subjects: [
                    { subjectId: ids(/^Jaro /), role: 'focus',
                        comment: 'some comment' },
                ]
            }),
        }, asFlatEJSON: true });

        deltas.subject.test({ expected: {
            // Jaro
            '0': { 'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/internals/participatedInStudies/2': (
                    ExpectedParticipation({
                        ...common, experimentId: newOne._id,
                        conditionName: 'other', role: 'focus',
                        totalSubjectCount: 1,
                    })
                ),
            }},
        }, asFlatEJSON: true });

        deltas.subjectGroup.test({ expected: {}});
        deltas.sequenceNumbers.test({ expected: {}});
    });
});

// NOTE: import records contain the whole parsed pipeline data; we only
// check the relevant parts of it
var ExpectedCSVImport = (expected) => (bag) => {
    var { baseline, current, pointer } = bag;
    var {
        csvImportId, fileId, studyId, createdBy,
        skipPossibleDuplicates, rows
    } = expected;

    try {
        expect(baseline).to.not.exist;

        var { pipelineData, createdAt, ...rest } = current;
        expect(rest).to.eql({
            '_id': { '$oid': String(csvImportId) },
            'type': 'experiment/wkprc-apestudies-default',
            'createdBy': { '$oid': String(createdBy) },
            'fileId': { '$oid': String(fileId) },
            'studyId': { '$oid': String(studyId) },
            'subjectType': 'wkprc_chimpanzee',
            'skipPossibleDuplicates': skipPossibleDuplicates,
        });
        expect(createdAt).to.have.property('$date');

        expect(pipelineData.map((it) => ({
            'index': it.index,
            'isValid': it.isValid,
            'isRefReplacementOk': it.isRefReplacementOk,
            'errorColumns': (it.replacementErrors || []).map(
                (err) => err.mapping.csvColumn
            ),
        }))).to.eql(rows.map((it, index) => ({
            index, isValid: true, ...it
        })));
    }
    catch (error) {
        error.message += ` at pointer ${pointer}`;
        throw error;
    }
}

var ExpectedExperiment = (bag) => {
    var {
        csvImportId, studyId, locationId, subjectGroupId,
        experimentOperatorId, timestamp, conditionName, subjects,
    } = bag;

    return {
        '_id': BaselineDeltas.AnyObjectId(),
        '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
        'type': 'manual',
        'realType': 'apestudies-wkprc-default',
        'csvImportId': csvImportId,
        'state': {
            '__locationType': 'wkprc_ape_location',
            'color': '',
            'experimentName': 'choice_task',
            'conditionName': conditionName,
            'experimentOperatorIds': [ experimentOperatorId ],
            'experimentOperatorTeamId': null,
            'generalComment': '',
            'interval': {
                'start': { '$date': timestamp },
                'end': { '$date': timestamp },
            },
            'isCanceled': false,
            'isPostprocessed': true,
            'locationId': locationId,
            'locationRecordType': 'wkprc_ape_location',
            'roomOrEnclosure': 'Observation Room',
            'selectedSubjectGroupIds': [],
            'selectedSubjectIds': subjects.map(it => it.subjectId),
            'seriesId': BaselineDeltas.AnyObjectId(),
            'studyId': studyId,
            'studyRecordType': 'wkprc_study',
            'subjectData': subjects.map(it => ({
                ...it,
                'subjectType': 'wkprc_chimpanzee',
                'invitationStatus': 'scheduled',
                'participationStatus': 'participated',
                'excludeFromMoreExperimentsInStudy': false,
            })),
            'subjectGroupId': subjectGroupId,
            'timezone': 'Europe/Berlin',
            'totalSubjectCount': subjects.length,
        },
    };
}

var ExpectedParticipation = (bag) => {
    var {
        csvImportId, studyId, locationId, experimentId, timestamp,
        conditionName, role, totalSubjectCount,
    } = bag;

    return {
        '_id': BaselineDeltas.AnyObjectId(),
        'experimentId': experimentId,
        'type': 'manual',
        'realType': 'apestudies-wkprc-default',
        'csvImportId': csvImportId,
        'studyId': studyId,
        'studyType': 'wkprc_study',
        'locationId': locationId,
        'locationType': 'wkprc_ape_location',
        'timestamp': { '$date': timestamp },
        'timezone': 'Europe/Berlin',
        'experimentName': 'choice_task',
        'conditionName': conditionName,
        'roomOrEnclosure': 'Observation Room',
        'totalSubjectCount': totalSubjectCount,
        'role': role,
        'status': 'participated',
        'excludeFromMoreExperimentsInStudy': false,
    };
}
