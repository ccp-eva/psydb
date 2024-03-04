'use strict';
var { MongoClient } = require('mongodb');
var { ejson } = require('@mpieva/psydb-core-utils');

var subjects = [
    { type: 'chimpanzee', label: 'Chimpanzee' },
    { type: 'bonobo', label: 'Bonobo' },
    { type: 'gorilla', label: 'Gorilla' },
    { type: 'orang_utan', label: 'Orang-Utan' },
];

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;
    var { mongodb: mongodbConnectString } = extraOptions;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }
    
    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );

    var db = mongo.db();

    var context = { apiKey, driver, db };
    for (var it of subjects) {
        await fixLocationField({
            apiKey, driver, db, type: `wkprc_${it.type}`, label: it.label,
        })
    }

    
    mongo.close();
}

var fixLocationField = async (bag) => {
    var { db, apiKey, driver, type, label } = bag;
    
    var crt = await db.collection('customRecordType').findOne({
        collection: 'subject',
        type
    }, { projection: { _id: true }});

    var { _id: crtId } = crt;

    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
                '/scientific/state/custom/biologicalGender',
                '/scientific/state/custom/dateOfBirth',
                '/scientific/state/custom/locationId',
                '/scientific/state/custom/groupId',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
                '/scientific/state/custom/locationId',
                '/scientific/state/custom/groupId',
            ]
        }
    }, { apiKey });
    await driver.sendMessage({
        type: `custom-record-types/patch-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'scientific',
            fieldKey: 'wkprcIdCode',
            props: {
                type: 'SaneString',
                key: 'wkprcIdCode',
                displayName: 'WKPRC-ID-Code',
                pointer: '/scientific/state/custom/wkprcIdCode',
                props: { minLength: 0 }
            }
        },
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/patch-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'scientific',
            fieldKey: 'groupId',
            props: {
                type: 'ForeignId',
                key: 'groupId',
                displayName: 'Group',
                pointer: '/scientific/state/custom/groupId',
                props: {
                    collection: 'subjectGroup',
                    isNullable: true,
                    displayEmptyAsUnknown: true,
                    addReferenceToTarget: false,
                    constraints: {
                        '/subjectType': type,
                        '/state/locationId': '$data:/scientific/state/custom/locationId'
                    },
                },
            }
        },
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/remove-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'scientific',
            key: 'totalOffspring',
        },
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/remove-field-definition`,
        payload: {
            id: crtId,
            subChannelKey: 'scientific',
            key: 'group',
        },
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'table',
            fieldPointers: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
                '/scientific/state/custom/biologicalGender',
                '/scientific/state/custom/dateOfBirth',
                '/scientific/state/custom/locationId',
                '/scientific/state/custom/groupId',
            ]
        }
    }, { apiKey });
    
    await driver.sendMessage({
        type: `custom-record-types/set-display-fields`,
        payload: {
            id: crtId,
            target: 'optionlist',
            fieldPointers: [
                '/scientific/state/custom/name',
                '/scientific/state/custom/wkprcIdCode',
                '/scientific/state/custom/locationId',
                '/scientific/state/custom/groupId',
            ]
        }
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder: [
            '/scientific/state/custom/name',
            '/scientific/state/custom/biologicalGender',
            '/scientific/state/custom/wkprcIdCode',
            '/scientific/state/custom/dateOfBirth',
            '/scientific/state/custom/subSpeciesId',
            '/scientific/state/custom/motherId',
            '/scientific/state/custom/fatherId',
            '/scientific/state/custom/knownOffspringIds',
            '/scientific/state/custom/locationId',
            '/scientific/state/custom/groupId',
            '/scientific/state/custom/rearingHistoryId',
            '/scientific/state/custom/originId',
            '/scientific/state/custom/arrivalDate',
            '/scientific/state/custom/arrivedFrom',
            '/scientific/state/comment',
        ]}
    }, { apiKey });

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label,
            requiresTestingPermissions: false,
            showOnlineId: false,
            showSequenceNumber: false,
            commentFieldIsSensitive: true,
        }
    }, { apiKey });
}
