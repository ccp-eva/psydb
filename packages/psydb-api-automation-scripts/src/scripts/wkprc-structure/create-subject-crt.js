'use strict';
var utils = require('../../utils');

var asPointers = (keys) => keys.map(it => (
    `/scientific/state/custom/${it}`
));

// NOTE: crtKey, crtId, crtRecord, CRT
var createSubjectCRT = async (bag) => {
    var { apiKey, driver, cache, type, label } = bag;

    var definitions = FieldDefinitions({ cache, type });
    var extra = FieldDefinitionsExtra({ cache, type });

    var crt = await utils.crt.create({
        driver,
        collection: 'subject', key: type,
        displayNames: { 'en': label }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({
        subChannelKey: 'scientific',
        definitions: [
            ...Object.values(definitions),
            ...Object.value(extra)
        ],
    });

    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#} (${#})',
            tokens: asPointers([ 'name', 'wkprcIdCode' ])
        },
        displayFields: {
            'table': asPointers([
                'name', 'wkprcIdCode', 'biologicalGender', 'dateOfBirth',
                'locationId', 'groupId',
            ]),
            'optionlist': asPointers([
                'name', 'wkprcIdCode',
                'locationId', 'groupId',
            ])
        },
        formOrder: [
            ...asPointers(Object.keys(definitions)),
            '/scientific/state/comment',
            ...asPointers(Object.keys(extra)),
        ]
    })

    await crt.updateGeneralSettings({
        displayNames: { 'en': label },
        requiresTestingPermissions: false,
        showOnlineId: false,
        showSequenceNumber: false,
        commentFieldIsSensitive: false,
    })

    return crtId;
}

var FieldDefinitions = ({ cache, type }) => ({
    'name': {
        type: 'SaneString',
        key: 'name',
        displayName: 'Name',
        props: { minLength: 1 }
    },

    'wkprcIdCode': {
        type: 'SaneString',
        key: 'wkprcIdCode',
        displayName: 'WKPRC-ID-Code',
        props: { minLength: 0 }
    },

    'biologicalGender': {
        type: 'BiologicalGender',
        key: 'biologicalGender',
        displayName: 'Sex',
        props: {
            enableUnknownValue: true,
        }
    },

    'dateOfBirth': {
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        props: { isNullable: true, isSpecialAgeFrameField: true }
    },

    'subSpeciesId': {
        type: 'HelperSetItemId',
        key: 'subSpeciesId',
        displayName: 'Sub-Species',
        props: {
            setId: cache.get(`/helperSet/${type}SubSpecies`),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },

    'rearingHistoryId': {
        type: 'HelperSetItemId',
        key: 'rearingHistoryId',
        displayName: 'Rearing History',
        props: {
            setId: cache.get('/helperSet/rearingHistory'),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },

    'originId': {
        type: 'HelperSetItemId',
        key: 'originId',
        displayName: 'Origin',
        props: {
            setId: cache.get('/helperSet/origin'),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },

    'arrivalDate': {
        type: 'DateOnlyServerSide',
        key: 'arrivalDate',
        displayName: 'Arrival Date',
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },

    'arrivedFrom': {
        type: 'SaneString',
        key: 'arrivedFrom',
        displayName: 'Arrived From',
        props: { minLength: 0 }
    },

    'locationId': {
        type: 'ForeignId',
        key: 'locationId',
        displayName: 'Location',
        props: {
            collection: 'location',
            recordType: 'wkprc_ape_location',
            isNullable: true,
            displayEmptyAsUnknown: true,
            addReferenceToTarget: false,
            constraints: {},
        },
    },

    'motherId': {
        type: 'ForeignId',
        key: 'motherId',
        displayName: 'Mother',
        props: {
            collection: 'subject',
            recordType: type,
            isNullable: true,
            displayEmptyAsUnknown: true,
            addReferenceToTarget: true,
            targetReferenceField: (
                '/scientific/state/custom/knownOffspringIds'
            ),
            constraints: {
                '/scientific/state/custom/biologicalGender': 'female',
            },
        },
    },

    'fatherId': {
        type: 'ForeignId',
        key: 'fatherId',
        displayName: 'Father',
        props: {
            collection: 'subject',
            recordType: type,
            isNullable: true,
            displayEmptyAsUnknown: true,
            addReferenceToTarget: true,
            targetReferenceField: (
                '/scientific/state/custom/knownOffspringIds'
            ),
            constraints: {
                '/scientific/state/custom/biologicalGender': 'male',
            },
        },
    },

    'knownOffSpringIds': {
        type: 'ForeignIdList',
        key: 'knownOffspringIds',
        displayName: 'Known Offspring',
        props: {
            collection: 'subject',
            recordType: type,
            minItems: 0,
            readOnly: true,
            constraints: {},
        },
    },

    'age': {
        type: 'Lambda',
        key: 'age',
        displayName: 'Age',
        props: {
            fn: 'deltaYMD',
            input: '/scientific/state/custom/dateOfBirth'
        }
    },

    'groupId': {
        type: 'ForeignId',
        key: 'groupId',
        displayName: 'Group',
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
    },
});

var FieldDefinitions = ({ cache, type }) => ({
    'sensitiveComment': {
        type: 'FullText',
        key: 'sensitiveComment', // sensitive_comment
        displayName: 'Sensitive Comment',
        props: {
            minLength: 0,
            isSensitive: true,
        },
    }
});


module.exports = createSubjectCRT
