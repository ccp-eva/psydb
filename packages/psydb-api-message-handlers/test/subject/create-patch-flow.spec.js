'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

// NOTE: characterization test for the subject create/patch handlers;
// the handlers are old and are going to be replaced, so this pins
// down their current behavior, including side effects on other
// records (e.g. knownOffspringIds of the parents)
describe('subject/[create|patch] flow', function () {
    var db, send;
    var researchGroupId, acquisitionId, rearingHistoryId;
    var motherId, otherMotherId, fatherId, trainerId, catShelterId;
    var ownerId, catId;

    before(async function () {
        await this.restore([ 'init-cats-with-data' ]);

        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

        researchGroupId = await this.getId('researchGroup', {
            shorthand: 'Cat-Lab'
        });
        acquisitionId = await this.getId('helperSetItem', {
            label: 'Word of Mouth'
        });
        rearingHistoryId = await this.getId('helperSetItem', {
            label: 'Hand-Reared'
        });

        // NOTE: founders have no parents themselves
        var femaleFounders = await findSubjects({ db, filter: {
            'type': 'cat',
            'scientific.state.custom.sex': 'female',
            'scientific.state.custom.motherId': null,
        }});
        var maleFounders = await findSubjects({ db, filter: {
            'type': 'cat',
            'scientific.state.custom.sex': 'male',
            'scientific.state.custom.motherId': null,
        }});
        ([ motherId, otherMotherId ] = femaleFounders.map(it => it._id));
        ([ fatherId ] = maleFounders.map(it => it._id));

        ([{ _id: trainerId }] = await findSubjects({ db, filter: {
            'type': 'catTrainer'
        }}));
        ({ _id: catShelterId } = await db.collection('location').findOne(
            { type: 'catShelter' }, { sort: { _id: 1 }}
        ));
    });

    step('create cat owner', async function () {
        var deltas = Deltas.call(this);
        await deltas.push();

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
                        'acquisitionId': acquisitionId,
                    },
                    'comment': 'some owner comment',
                    'systemPermissions': {
                        'isHidden': false,
                        'accessRightsByResearchGroup': [
                            { researchGroupId, permission: 'write' }
                        ],
                    },
                    'testingPermissions': [
                        { researchGroupId, permissionList: [
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

        await deltas.push();
        var ix = deltas.indexOf(ownerId);

        deltas.subject.test({ expected: { [ix]: {
            '_id': ownerId,
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'type': 'catOwner',
            'sequenceNumber': '61',
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
        }}, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/subject/catOwner': 61
        }});
    });

    step('create cat', async function () {
        var deltas = Deltas.call(this);
        await deltas.push();

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
                        'trainerId': trainerId,
                        'motherId': motherId,
                        'fatherId': fatherId,
                        'catShelterId': catShelterId,
                        'groupId': null,
                        'rearingHistoryId': rearingHistoryId,
                        'shelterArrivalDate': null,
                        'isSterilized': 'no',
                        'wasFound': false,
                    },
                    'comment': '',
                    'systemPermissions': {
                        'isHidden': false,
                        'accessRightsByResearchGroup': [
                            { researchGroupId, permission: 'write' }
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

        await deltas.push();

        deltas.subject.test({ expected: {
            [deltas.indexOf(catId)]: {
                '_id': catId,
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'type': 'cat',
                'sequenceNumber': '101',
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
            ...deltas.expectOffspringAdded({ parentId: motherId, catId }),
            ...deltas.expectOffspringAdded({ parentId: fatherId, catId }),
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {
            '/0/subject/cat': 101
        }});
    });

    step('patch cat', async function () {
        var deltas = Deltas.call(this);
        await deltas.push();

        var cat = deltas.getRecord(catId);
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
                        'motherId': otherMotherId,
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

        await deltas.push();

        deltas.subject.test({ expected: {
            [deltas.indexOf(catId)]: {
                'gdpr': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state/custom/name': 'Mittens UPDATED',
                },
                'scientific': {
                    '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                    'state/custom/ownerIds': [],
                    'state/custom/motherId': otherMotherId,
                    'state/custom/fatherId': null,
                    'state/custom/isSterilized': 'yes',
                    'state/comment': 'some cat comment',
                },
            },
            // NOTE: offspring moves from the old to the new mother,
            // and is removed from the (now unset) father
            ...deltas.expectOffspringRemoved({ parentId: motherId, catId }),
            ...deltas.expectOffspringAdded({
                parentId: otherMotherId, catId
            }),
            ...deltas.expectOffspringRemoved({ parentId: fatherId, catId }),
        }, asFlatEJSON: true });

        deltas.sequenceNumbers.test({ expected: {}});
    });

    step('patch cat owner', async function () {
        var deltas = Deltas.call(this);
        await deltas.push();

        var owner = deltas.getRecord(ownerId);
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
                        { researchGroupId, permissionList: [
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

        await deltas.push();

        deltas.subject.test({ expected: {
            [deltas.indexOf(ownerId)]: {
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
var Deltas = function () {
    var subject = BaselineDeltas();
    var sequenceNumbers = BaselineDeltas();

    // NOTE: getBaseline_RAW() is not updated by push()
    var baselineRaw = undefined;
    var currentRaw = undefined;

    var push = async () => {
        baselineRaw = currentRaw;
        currentRaw = await this.fetchAllRecords('subject');
        subject.push(currentRaw);
        sequenceNumbers.push(await this.fetchAllRecords('sequenceNumbers'));
    }

    var indexOf = (id) => {
        var ix = subject.getCurrent().findIndex(
            it => it._id.$oid === String(id)
        );
        if (ix < 0) {
            throw new Error(`no subject with id "${id}"`);
        }
        return ix;
    }

    var getRecord = (id) => currentRaw[indexOf(id)];

    var getBaselineOffspring = (parentId) => {
        var parent = baselineRaw.find(
            it => String(it._id) === String(parentId)
        );
        return parent.scientific.state.custom.knownOffspringIds || [];
    }

    var expectOffspringAdded = (bag) => {
        var { parentId, catId } = bag;
        var offspring = getBaselineOffspring(parentId);
        return { [indexOf(parentId)]: { 'scientific': {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            [`state/custom/knownOffspringIds/${offspring.length}`]: catId,
        }}};
    }

    var expectOffspringRemoved = (bag) => {
        var { parentId, catId } = bag;
        var offspring = getBaselineOffspring(parentId);
        var ix = offspring.findIndex(it => String(it) === String(catId));
        return { [indexOf(parentId)]: { 'scientific': {
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            [`state/custom/knownOffspringIds/${ix}`]: BaselineDeltas.DeletedValue(),
        }}};
    }

    return {
        subject, sequenceNumbers,
        push, indexOf, getRecord,
        expectOffspringAdded, expectOffspringRemoved,
    };
}

var findSubjects = async (bag) => {
    var { db, filter } = bag;
    return db.collection('subject').find(filter, {
        sort: { _id: 1 }
    }).toArray();
}

var DefaultInternals = () => ({
    'isRemoved': false,
    'invitedForExperiments': [],
    'participatedInStudies': [],
    'mergedDuplicates': [],
    'nonDuplicateIds': [],
});
