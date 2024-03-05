'use strict';
var asPointers = (keys) => keys.map(it => (
    `/scientific/state/custom/${it}`
));

// NOTE: crtKey, crtId, crtRecord, CRT
var createSubjectCRT = async (bag) => {
    var { driver, cache, type, label } = bag;

    var definitions = FieldDefinitions({ cache, type });
    var extra = FieldDefinitionsExtra({ cache, type });

    var crt = await driver.crt.create({
        collection: 'subject', key: type,
        displayNames: { 'en': label }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ subChannelKey: 'scientific', definitions: [
        ...Object.values(definitions),
        ...Object.values(extra)
    ]});

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
        displayNameI18N: {},
        props: { minLength: 1 }
    },

    'biologicalGender': {
        type: 'BiologicalGender',
        key: 'biologicalGender',
        displayName: 'Sex',
        displayNameI18N: {},
        props: {
            enableUnknownValue: true,
            enableOtherValue: false,
        }
    },

    'wkprcIdCode': {
        type: 'SaneString',
        key: 'wkprcIdCode',
        displayName: 'WKPRC-ID-Code',
        displayNameI18N: {},
        props: { minLength: 0 }
    },

    'dateOfBirth': {
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: {},
        props: { isNullable: true, isSpecialAgeFrameField: true }
    },

    'age': {
        type: 'Lambda',
        key: 'age',
        displayName: 'Age',
        displayNameI18N: {},
        props: {
            fn: 'deltaYMD',
            input: '/scientific/state/custom/dateOfBirth'
        }
    },

    'subSpeciesId': {
        type: 'HelperSetItemId',
        key: 'subSpeciesId',
        displayName: 'Sub-Species',
        displayNameI18N: {},
        props: {
            setId: cache.get(`/helperSet/${type}SubSpecies`),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },

    'motherId': {
        type: 'ForeignId',
        key: 'motherId',
        displayName: 'Mother',
        displayNameI18N: {},
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
        displayNameI18N: {},
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

    'knownOffspringIds': {
        type: 'ForeignIdList',
        key: 'knownOffspringIds',
        displayName: 'Known Offspring',
        displayNameI18N: {},
        props: {
            collection: 'subject',
            recordType: type,
            minItems: 0,
            readOnly: true,
            constraints: {},
        },
    },
    
    'locationId': {
        type: 'ForeignId',
        key: 'locationId',
        displayName: 'Location',
        displayNameI18N: {},
        props: {
            collection: 'location',
            recordType: 'wkprc_ape_location',
            isNullable: true,
            displayEmptyAsUnknown: true,
            addReferenceToTarget: false,
            constraints: {},
        },
    },

    'groupId': {
        type: 'ForeignId',
        key: 'groupId',
        displayName: 'Group',
        displayNameI18N: {},
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

    'rearingHistoryId': {
        type: 'HelperSetItemId',
        key: 'rearingHistoryId',
        displayName: 'Rearing History',
        displayNameI18N: {},
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
        displayNameI18N: {},
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
        displayNameI18N: {},
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },

    'arrivedFrom': {
        type: 'SaneString',
        key: 'arrivedFrom',
        displayName: 'Arrived From',
        displayNameI18N: {},
        props: { minLength: 0 }
    },

});

var FieldDefinitionsExtra = ({ cache, type }) => ({
    'sensitiveComment': {
        type: 'FullText',
        key: 'sensitiveComment', // sensitive_comment
        displayName: 'Sensitive Comment',
        displayNameI18N: {},
        props: {
            minLength: 0,
            isSensitive: true,
        },
    }
});


module.exports = createSubjectCRT
