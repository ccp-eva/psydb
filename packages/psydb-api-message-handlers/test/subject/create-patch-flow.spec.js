'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var COLLECTIONS = [ 'subject', 'sequenceNumbers' ];

// NOTE: characterization test for the subject create/patch handlers;
// the handlers are old and are going to be replaced, so this pins
// down their current behavior, including side effects on other
// records (e.g. knownOffspringIds of the parents)
describe('subject/[create|patch] flow', function () {
    var ids, send, deltas;
    var ownerId, catId;

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

    step('create cat owner', async function () {
        var payload = {
            'props': {
                'gdpr': { 'custom': {
                    'firstname': 'Alice',
                    'lastname': 'Catlover',
                    'gender': 'female',
                    // NOTE: midnight in Europe/Berlin
                    'dateOfBirth': '1985-03-11T23:00:00.000Z',
                    'address': {
                        'street': 'Musterstraße',
                        'housenumber': '12',
                        'affix': 'b',
                        'postcode': '01234',
                        'city': 'Musterstadt',
                        'country': 'DE',
                    },
                    'emails': [
                        { 'email': 'alice@example.com', 'isPrimary': true },
                    ],
                    'phones': [
                        { 'number': '0341 1234567', 'type': 'private' },
                    ],
                }},
                'scientific': {
                    'custom': {
                        'doesDBRegistrationConsentOnPaperExist': true,
                        'acquisitionId': ids('Word of Mouth'),
                    },
                    'comment': 'some owner comment',
                    'systemPermissions': {
                        'isHidden': false,
                        'accessRightsByResearchGroup': [
                            {
                                researchGroupId: ids('Cat-Lab'),
                                permission: 'write'
                            }
                        ],
                    },
                    'testingPermissions': [
                        { researchGroupId: ids('Cat-Lab'), permissionList: [
                            { labProcedureTypeKey: 'inhouse', value: 'yes' },
                            { labProcedureTypeKey: 'away-team', value: 'no' },
                        ]}
                    ],
                },
            }
        };

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'subject/catOwner/create',
            timezone: 'Europe/Berlin',
            payload,
        }));
        ownerId = channelId;

        await deltas.update();

        deltas.subject.test({ expected: {
            [indexOf(deltas.subject, ownerId)]: {
                '_id': ownerId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'type': 'catOwner',
                'sequenceNumber': '6',
                'isDummy': false,
                'onlineId': BaselineDeltas.AnyString(),
                'gdpr': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state': { 'custom': {
                        ...payload.props.gdpr.custom,
                        'dateOfBirth': { '$date': '1985-03-12T00:00:00.000Z' },
                    }},
                },
                'scientific': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state': {
                        ...payload.props.scientific,
                        'internals': DefaultInternals(),
                    },
                },
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/subject/catOwner': 6
        }});
    });

    step('create cat', async function () {
        await deltas.update();

        var payload = {
            'props': {
                'gdpr': { 'custom': {
                    'name': 'Mittens',
                }},
                'scientific': {
                    'custom': {
                        // NOTE: midnight in Europe/Berlin
                        'dateOfBirth': '2024-04-30T22:00:00.000Z',
                        'sex': 'female',
                        'ownerIds': [ ownerId ],
                        'trainerId': ids(/^Gymnastics, Shoestring /),
                        'motherId': ids(/^Monsoon /),
                        'fatherId': ids(/^Music-box /),
                        'catShelterId': ids(/^Rhoda Estates /),
                        'groupId': null,
                        'rearingHistoryId': ids('Hand-Reared'),
                        'shelterArrivalDate': null,
                        'isSterilized': 'no',
                        'wasFound': false,
                    },
                    'comment': '',
                    'systemPermissions': {
                        'isHidden': false,
                        'accessRightsByResearchGroup': [
                            {
                                researchGroupId: ids('Cat-Lab'),
                                permission: 'write'
                            }
                        ],
                    },
                },
            }
        };

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'subject/cat/create',
            timezone: 'Europe/Berlin',
            payload,
        }));
        catId = channelId;

        await deltas.update();

        deltas.subject.test({ expected: {
            [indexOf(deltas.subject, catId)]: {
                '_id': catId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'type': 'cat',
                'sequenceNumber': '6',
                'isDummy': false,
                'onlineId': BaselineDeltas.AnyString(),
                'gdpr': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state': { 'custom': payload.props.gdpr.custom },
                },
                'scientific': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state': {
                        ...payload.props.scientific,
                        'custom': {
                            ...payload.props.scientific.custom,
                            'dateOfBirth': {
                                '$date': '2024-05-01T00:00:00.000Z'
                            },
                        },
                        // NOTE: not in payload; set by default
                        'testingPermissions': [],
                        'internals': DefaultInternals(),
                    },
                },
            },
            // NOTE: parents get the new cat added to their offspring
            ...expectOffspringAdded(deltas.subject, {
                parentId: ids(/^Monsoon /), catId
            }),
            ...expectOffspringAdded(deltas.subject, {
                parentId: ids(/^Music-box /), catId
            }),
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/subject/cat': 6
        }});
    });

    step('patch cat', async function () {
        var cat = getRecord(deltas.subject, catId);
        var payload = {
            'id': catId,
            'props': {
                'gdpr': { 'custom': {
                    'name': 'Mittens UPDATED',
                }},
                'scientific': {
                    'custom': {
                        ...cat.scientific.state.custom,
                        'ownerIds': [],
                        'motherId': ids(/^Bongo /),
                        'fatherId': null,
                        'isSterilized': 'yes',
                    },
                    'comment': 'some cat comment',
                    'systemPermissions': cat.scientific.state.systemPermissions,
                },
            }
        };

        await send({
            type: 'subject/cat/patch',
            timezone: 'Europe/Berlin',
            payload,
        });

        await deltas.update();

        deltas.subject.test({ expected: {
            [indexOf(deltas.subject, catId)]: {
                'gdpr': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state/custom/name': 'Mittens UPDATED',
                },
                'scientific': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state/custom/ownerIds': [],
                    'state/custom/motherId': ids(/^Bongo /),
                    'state/custom/fatherId': null,
                    'state/custom/isSterilized': 'yes',
                    'state/comment': 'some cat comment',
                },
            },
            // NOTE: offspring moves from the old to the new mother,
            // and is removed from the (now unset) father
            ...expectOffspringRemoved(deltas.subject, {
                parentId: ids(/^Monsoon /), catId
            }),
            ...expectOffspringAdded(deltas.subject, {
                parentId: ids(/^Bongo /), catId
            }),
            ...expectOffspringRemoved(deltas.subject, {
                parentId: ids(/^Music-box /), catId
            }),
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {}});
    });

    step('patch cat owner', async function () {
        var owner = getRecord(deltas.subject, ownerId);
        var payload = {
            'id': ownerId,
            'props': {
                'gdpr': { 'custom': {
                    ...owner.gdpr.state.custom,
                    'lastname': 'Catlover UPDATED',
                    'emails': [
                        { 'email': 'alice@example.com', 'isPrimary': false },
                        { 'email': 'alice2@example.com', 'isPrimary': true },
                    ],
                }},
                'scientific': {
                    'custom': owner.scientific.state.custom,
                    'comment': owner.scientific.state.comment,
                    'systemPermissions': (
                        owner.scientific.state.systemPermissions
                    ),
                    'testingPermissions': [
                        { researchGroupId: ids('Cat-Lab'), permissionList: [
                            { labProcedureTypeKey: 'inhouse', value: 'no' },
                            { labProcedureTypeKey: 'away-team', value: 'yes' },
                        ]}
                    ],
                },
            }
        };

        await send({
            type: 'subject/catOwner/patch',
            timezone: 'Europe/Berlin',
            payload,
        });

        await deltas.update();

        deltas.subject.test({ expected: {
            [indexOf(deltas.subject, ownerId)]: {
                'gdpr': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state/custom/lastname': 'Catlover UPDATED',
                    'state/custom/emails/0/isPrimary': false,
                    'state/custom/emails/1': {
                        'email': 'alice2@example.com', 'isPrimary': true
                    },
                },
                'scientific': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state/testingPermissions/0/permissionList/0/value': 'no',
                    'state/testingPermissions/0/permissionList/1/value': 'yes',
                },
            },
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {}});
    });
});

// NOTE: we have long collections, so expected deltas are keyed by the
// index of the record in the current state, looked up by its id
var indexOf = (deltas, id) => {
    var ix = deltas.getCurrent().findIndex(
        it => it._id.$oid === String(id)
    );
    if (ix < 0) {
        throw new Error(`no record with id "${id}"`);
    }
    return ix;
}

var getRecord = (deltas, id) => deltas.getCurrent_RAW()[indexOf(deltas, id)];

// NOTE: getBaseline_RAW() returns the ejson'd state after push(),
// so we use the ejson baseline and compare via $oid
var getBaselineOffspring = (deltas, parentId) => {
    var parent = deltas.getBaseline().find(
        it => it._id.$oid === String(parentId)
    );
    return parent.scientific.state.custom.knownOffspringIds || [];
}

var expectOffspringAdded = (deltas, bag) => {
    var { parentId, catId } = bag;
    var offspring = getBaselineOffspring(deltas, parentId);
    return { [indexOf(deltas, parentId)]: { 'scientific': {
        '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
        [`state/custom/knownOffspringIds/${offspring.length}`]: catId,
    }}};
}

var expectOffspringRemoved = (deltas, bag) => {
    var { parentId, catId } = bag;
    var offspring = getBaselineOffspring(deltas, parentId);
    var ix = offspring.findIndex(it => it.$oid === String(catId));
    return { [indexOf(deltas, parentId)]: { 'scientific': {
        '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
        // NOTE: when the list becomes empty the empty array itself
        // needs to be expected, a deleted item wont match
        ...(
            offspring.length === 1
            ? { 'state/custom/knownOffspringIds': [] }
            : { [`state/custom/knownOffspringIds/${ix}`]: (
                BaselineDeltas.DeletedValue()
            )}
        ),
    }}};
}

var DefaultInternals = () => ({
    'isRemoved': false,
    'invitedForExperiments': [],
    'participatedInStudies': [],
    'mergedDuplicates': [],
    'nonDuplicateIds': [],
});
