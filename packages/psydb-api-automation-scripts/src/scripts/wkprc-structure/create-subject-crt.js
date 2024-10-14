'use strict';
var asPointers = (keys) => keys.map(it => (
    `/scientific/state/custom/${it}`
));

// NOTE: crtKey, crtId, crtRecord, CRT
var createSubjectCRT = async (bag) => {
    var { driver, cache, type, displayNames } = bag;

    var definitions = FieldDefinitions({ cache, type });
    var extra = FieldDefinitionsExtra({ cache, type });

    var crt = await driver.crt.create({
        collection: 'subject', key: type,
        displayNames
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
                'locationId', 'groupId', 'age'
            ]),
            'optionlist': asPointers([
                'name', 'wkprcIdCode', 'biologicalGender',
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
        displayNames,
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
        displayNameI18N: { de: 'Name' },
        props: { minLength: 1 }
    },

    'biologicalGender': {
        type: 'BiologicalGender',
        key: 'biologicalGender',
        displayName: 'Sex',
        displayNameI18N: { de: 'Geschlecht' },
        props: {
            enableUnknownValue: true,
            enableOtherValue: false,
        }
    },

    'wkprcIdCode': {
        type: 'SaneString',
        key: 'wkprcIdCode',
        displayName: 'WKPRC-ID-Code',
        displayNameI18N: { de: 'WKPRC-ID-Code' },
        props: { minLength: 0 }
    },

    'dateOfBirth': {
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { de: 'Geburtsdatum '},
        props: { isNullable: true, isSpecialAgeFrameField: true }
    },

    'age': {
        type: 'Lambda',
        key: 'age',
        displayName: 'Age',
        displayNameI18N: { de: 'Alter' },
        props: {
            fn: 'deltaYMD',
            input: '/scientific/state/custom/dateOfBirth'
        }
    },

    'subSpeciesId': {
        type: 'HelperSetItemId',
        key: 'subSpeciesId',
        displayName: 'Sub-Species',
        displayNameI18N: { de: 'Sub-Spezies' },
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
        displayNameI18N: { de: 'Mutter' },
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
        displayNameI18N: { de: 'Vater' },
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
        displayNameI18N: { de: 'Bekannte Nachkommen' },
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
        displayNameI18N: { de: 'Location' },
        props: {
            collection: 'location',
            recordType: 'wkprc_apeLocation', // XXX: was wkprc_ape_location
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
        displayNameI18N: { de: 'Gruppe' },
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
        displayNameI18N: { de: 'Aufzucht' },
        props: {
            setId: cache.get('/helperSet/wkprc_rearingHistory'),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },

    'originId': {
        type: 'HelperSetItemId',
        key: 'originId',
        displayName: 'Origin',
        displayNameI18N: { de: 'Herkunft' },
        props: {
            setId: cache.get('/helperSet/wkprc_origin'),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },

    'arrivalDate': {
        type: 'DateOnlyServerSide',
        key: 'arrivalDate',
        displayName: 'Arrival Date',
        displayNameI18N: { de: 'Ankunft Am' },
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },

    'arrivedFrom': {
        type: 'SaneString',
        key: 'arrivedFrom',
        displayName: 'Arrived From',
        displayNameI18N: { de: 'Ankunft Aus'},
        props: { minLength: 0 }
    },

});

var FieldDefinitionsExtra = ({ cache, type }) => ({
    'sensitiveComment': {
        type: 'FullText',
        key: 'sensitiveComment', // sensitive_comment
        displayName: 'Sensitive Comment',
        displayNameI18N: { de: 'Geschützter Kommentar' },
        props: {
            minLength: 0,
            isSensitive: true,
        },
    }
});


module.exports = createSubjectCRT
