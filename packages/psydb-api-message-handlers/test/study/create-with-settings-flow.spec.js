'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS, PROPS_AS_STATE }
    = require('@mpieva/psydb-api-mocha-test-tools/utils');

var COLLECTIONS = [
    'study',
    'subjectSelector',
    'ageFrame',
    'experimentVariant',
    'experimentVariantSetting',
    'experimentOperatorTeam',
    'sequenceNumbers',
];

// NOTE: creates a study and sets up its subject selection settings,
// experiment settings and teams, like the study pages in the ui do
describe('study/create with settings flow', function () {
    var ids, send, deltas;
    var studyId, selectorId, variantId;

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
                'start': '2025-12-31T23:00:00.000Z', 'end': null
            },
            'researchGroupIds': [ ids('Cat-Lab') ],
            'systemPermissions': {
                'accessRightsByResearchGroup': [{
                    'researchGroupId': ids('Cat-Lab'),
                    'permission': 'write'
                }],
                'isHidden': false,
            },
            'custom': {
                'experimenterIds': [ ids(/Cat-RA/) ],
                'helperStaffIds': [],
                'equipmentLinks': [],
                'equipmentLocation': '',
                'publicationDOI': '',
                'description': '',
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
        expectUnchanged(deltas, { except: [ 'study', 'sequenceNumbers' ]});
    });

    step('create subject selector', async function () {
        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'subjectSelector/create',
            timezone: 'Europe/Berlin',
            payload: {
                'subjectTypeKey': 'cat',
                'studyId': studyId,
                'props': { 'isEnabled': true, 'generalConditions': [] },
            },
        }));
        selectorId = channelId;

        await deltas.update();

        deltas.subjectSelector.test({ expected: {
            '0': {
                '_id': selectorId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'isDummy': false,
                'sequenceNumber': '1',
                'studyId': studyId,
                'subjectTypeKey': 'cat',
                'state': { 'isEnabled': true, 'generalConditions': [] },
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/subjectSelector': 1
        }});
        expectUnchanged(deltas, {
            except: [ 'subjectSelector', 'sequenceNumbers' ]
        });
    });

    step('create age frame', async function () {
        var [{ channelId: ageFrameId }] = await KOA_CHANNELS(send({
            type: 'ageFrame/create',
            timezone: 'Europe/Berlin',
            payload: {
                'subjectTypeKey': 'cat',
                'studyId': studyId,
                'subjectSelectorId': selectorId,
                'props': {
                    'interval': {
                        'start': { 'years': 1, 'months': 0, 'days': 0 },
                        'end': { 'years': 10, 'months': 0, 'days': 0 },
                    },
                    'conditions': [{
                        'pointer': '/scientific/state/custom/sex',
                        'values': [ 'female', 'male' ],
                    }],
                },
            },
        }));

        await deltas.update();

        deltas.ageFrame.test({ expected: {
            '0': {
                '_id': ageFrameId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'isDummy': false,
                'sequenceNumber': '1',
                'studyId': studyId,
                'subjectSelectorId': selectorId,
                'subjectTypeKey': 'cat',
                'state': {
                    'interval': {
                        'start': { 'years': 1, 'months': 0, 'days': 0 },
                        'end': { 'years': 10, 'months': 0, 'days': 0 },
                    },
                    'conditions': [{
                        'pointer': '/scientific/state/custom/sex',
                        'values': [ 'female', 'male' ],
                    }],
                },
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/ageFrame': 1
        }});
        expectUnchanged(deltas, { except: [ 'ageFrame', 'sequenceNumbers' ]});
    });

    step('create away-team experiment variant', async function () {
        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'experimentVariant/create',
            timezone: 'Europe/Berlin',
            payload: {
                'type': 'away-team',
                'studyId': studyId,
                'props': { 'isEnabled': true },
            },
        }));
        variantId = channelId;

        await deltas.update();

        deltas.experimentVariant.test({ expected: {
            '0': {
                '_id': variantId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'isDummy': false,
                'sequenceNumber': '1',
                'type': 'away-team',
                'studyId': studyId,
                'state': { 'isEnabled': true },
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/experimentVariant': 1
        }});
        expectUnchanged(deltas, {
            except: [ 'experimentVariant', 'sequenceNumbers' ]
        });
    });

    step('create away-team experiment variant setting', async function () {
        var [{ channelId: settingId }] = await KOA_CHANNELS(send({
            type: 'experiment-variant-setting/away-team/create',
            timezone: 'Europe/Berlin',
            payload: {
                'studyId': studyId,
                'experimentVariantId': variantId,
                'props': {
                    'subjectTypeKey': 'cat',
                    'subjectLocationFieldPointer': (
                        '/scientific/state/custom/catShelterId'
                    ),
                },
            },
        }));

        await deltas.update();

        // NOTE: settings get neither a sequence number nor isDummy
        deltas.experimentVariantSetting.test({ expected: {
            '0': {
                '_id': settingId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'type': 'away-team',
                'studyId': studyId,
                'experimentVariantId': variantId,
                'state': {
                    'subjectTypeKey': 'cat',
                    'subjectLocationFieldPointer': (
                        '/scientific/state/custom/catShelterId'
                    ),
                },
            },
        }, asFlatEJSON: true });

        expectUnchanged(deltas, { except: [ 'experimentVariantSetting' ]});
    });

    step('create experiment operator team', async function () {
        var [{ channelId: teamId }] = await KOA_CHANNELS(send({
            type: 'experimentOperatorTeam/create',
            timezone: 'Europe/Berlin',
            payload: {
                'studyId': studyId,
                'props': {
                    'color': '#ff8800',
                    'researchGroupId': ids('Cat-Lab'),
                    'personnelIds': [ ids(/Cat-RA/), ids(/Cat-Scientist/) ],
                    'hidden': false,
                },
            },
        }));

        await deltas.update();

        // NOTE: teams get neither a sequence number nor isDummy
        deltas.experimentOperatorTeam.test({ expected: {
            '0': {
                '_id': teamId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'studyId': studyId,
                'state': {
                    'color': '#ff8800',
                    'researchGroupId': ids('Cat-Lab'),
                    'personnelIds': [ ids(/Cat-RA/), ids(/Cat-Scientist/) ],
                    'hidden': false,
                    // NOTE: generated from the labels of the members
                    'name': 'Cat-RA, Test; Cat-Scientist, Test',
                },
            },
        }, asFlatEJSON: true });

        expectUnchanged(deltas, { except: [ 'experimentOperatorTeam' ]});
    });
});

var expectUnchanged = (deltas, bag) => {
    var { except } = bag;
    for (var it of COLLECTIONS) {
        if (!except.includes(it)) {
            deltas[it].test({ expected: {}});
        }
    }
}
