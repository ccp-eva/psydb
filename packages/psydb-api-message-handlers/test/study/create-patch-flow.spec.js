'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var COLLECTIONS = [ 'study', 'sequenceNumbers' ];

// NOTE: characterization test for the study create/patch handlers,
// analogous to test/subject/create-patch-flow.spec.js
describe('study/[create|patch] flow', function () {
    var ids, send, deltas;
    var studyId;

    before(async function () {
        ids = await this.restore([ 'init-cats-with-data-small' ], {
            gatherIds: true
        });

        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

        deltas = BaselineDeltas.Multi(COLLECTIONS);
        deltas.update = async () => {
            deltas.push(await this.aggregateAll(COLLECTIONS));
        }

        await deltas.update();
    });

    step('create cat study', async function () {
        var payload = { 'type': 'catStudy', 'props': {
            'name': 'Cats and Boxes',
            'shorthand': 'CatBox',
            'runningPeriod': {
                // NOTE: midnight in Europe/Berlin
                'start': '2025-12-31T23:00:00.000Z',
                'end': null,
            },
            'researchGroupIds': [ ids('Cat-Lab') ],
            'systemPermissions': {
                'accessRightsByResearchGroup': [
                    {
                        'researchGroupId': ids('Cat-Lab'),
                        'permission': 'write'
                    }
                ],
                'isHidden': false,
            },
            'custom': {
                'experimenterIds': [ ids(/Cat-RA/) ],
                'helperStaffIds': [],
                'equipmentLinks': [ 'https://example.com/box.jpg' ],
                'equipmentLocation': 'Shelf 3',
                'publicationDOI': '',
                'description': 'do cats prefer boxes over cushions',
            },
        }};

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'study/create',
            timezone: 'Europe/Berlin',
            payload,
        }));
        studyId = channelId;

        await deltas.update();

        deltas.study.test({ expected: {
            // NOTE: the fixture has no studies yet
            '0': {
                '_id': studyId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'isDummy': false,
                'sequenceNumber': '1',
                'type': 'catStudy',
                'state': {
                    ...PROPS_AS_STATE(payload).state,
                    // NOTE: stored as midnight UTC; end being null
                    // is not stored at all
                    'runningPeriod': {
                        'start': { '$date': '2026-01-01T00:00:00.000Z' },
                    },
                    'enableFollowUpExperiments': false,
                    'excludedOtherStudyIds': [],
                    'scientistIds': [],
                    'studyTopicIds': [],

                    'inhouseTestLocationSettings': [], // XXX obsolete
                    'isCreateFinalized': true, // XXX: obsolete
                },
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/study/catStudy': 1
        }});
    });

    step('patch cat study', async function () {
        var study = deltas.study.getCurrent_RAW()[0];
        var payload = {
            '_id': studyId,
            'props': {
                'name': 'Cats and Boxes UPDATED',
                'shorthand': study.state.shorthand,
                'runningPeriod': {
                    'start': study.state.runningPeriod.start,
                    // NOTE: midnight in Europe/Berlin
                    'end': '2026-06-29T22:00:00.000Z',
                },
                'researchGroupIds': study.state.researchGroupIds,
                'systemPermissions': study.state.systemPermissions,
                'custom': {
                    ...study.state.custom,
                    'experimenterIds': [
                        ids(/Cat-RA/), ids(/Cat-Scientist/)
                    ],
                    'equipmentLinks': [],
                    'publicationDOI': '10.1234/catbox',
                },
            }
        };

        await send({
            type: 'study/patch',
            timezone: 'Europe/Berlin',
            payload,
        });

        await deltas.update();

        deltas.study.test({ expected: {
            '0': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/name': 'Cats and Boxes UPDATED',
                // NOTE: stored as midnight UTC
                'state/runningPeriod/end': {
                    '$date': '2026-06-30T00:00:00.000Z'
                },
                'state/custom/experimenterIds/1': ids(/Cat-Scientist/),
                'state/custom/equipmentLinks': [],
                'state/custom/publicationDOI': '10.1234/catbox',
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {}});
    });
});
