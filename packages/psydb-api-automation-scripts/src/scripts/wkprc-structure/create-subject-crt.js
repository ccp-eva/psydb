'use strict';
var asPointers = (keys) => keys.map(it => (
    `/scientific/state/custom/${it}`
));

// NOTE: field order as on the live system; removed fields
// "group" and "totalOffspring" are left out
var FIELD_ORDER = [
    'name', 'wkprcIdCode', 'biologicalGender', 'dateOfBirth',
    'subSpeciesId', 'rearingHistoryId', 'originId',
    'arrivalDate', 'arrivedFrom', 'locationId',
    'motherId', 'fatherId', 'knownOffspringIds', 'groupId',
    'age', 'sensitive_comment', 'leavingDate',
];

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

    var all = { ...definitions, ...extra };
    await crt.addManyFields({ subChannelKey: 'scientific', definitions: (
        FIELD_ORDER.map(key => all[key])
    )});

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
            ...asPointers([
                'name', 'biologicalGender', 'wkprcIdCode', 'dateOfBirth',
                'age', 'subSpeciesId', 'motherId', 'fatherId',
                'knownOffspringIds', 'locationId', 'groupId',
                'rearingHistoryId', 'originId', 'arrivalDate', 'arrivedFrom',
                'leavingDate',
            ]),
            '/scientific/state/comment',
            ...asPointers([ 'sensitive_comment' ]),
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
        props: { minLength: 1 }
    },

    'biologicalGender': {
        type: 'BiologicalGender',
        key: 'biologicalGender',
        displayName: 'Sex',
        props: {
            enableUnknownValue: true,
        }
    },

    'wkprcIdCode': {
        type: 'SaneString',
        key: 'wkprcIdCode',
        displayName: 'WKPRC-ID-Code',
        props: { minLength: 0 }
    },

    'dateOfBirth': {
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        props: { isNullable: true, isSpecialAgeFrameField: true }
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

    'motherId': {
        type: 'ForeignId',
        key: 'motherId',
        displayName: 'Mother',
        props: {
            collection: 'subject',
            recordType: type,
            isNullable: true,
            displayEmptyAsUnknown: false,
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
            displayEmptyAsUnknown: false,
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
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },

    'arrivedFrom': {
        type: 'SaneString',
        key: 'arrivedFrom',
        displayName: 'Arrived From',
        props: { minLength: 0 }
    },

});

var FieldDefinitionsExtra = ({ cache, type }) => ({
    'sensitive_comment': {
        type: 'FullText',
        key: 'sensitive_comment', // sensitive_comment
        displayName: 'Sensitive Comment',
        props: {
            isSensitive: true,
        },
    },

    'leavingDate': {
        type: 'DateOnlyServerSide',
        key: 'leavingDate',
        displayName: 'Leaving Date',
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },
});


module.exports = createSubjectCRT
