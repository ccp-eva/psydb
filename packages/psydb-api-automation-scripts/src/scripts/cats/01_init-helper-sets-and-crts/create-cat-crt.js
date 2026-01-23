'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'subject', key: 'cat',
        displayNames: {
            'en': 'Cats',
            'de': 'Katzen',
        }
    });
    
    cache.addCRT(crt.meta);
    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();
    
    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#} (${#})',
            tokens: asPointers([ 'name', 'sex' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'name', 'sex', 'dateOfBirth'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'name', 'sex', 'dateOfBirth'
            ])],
        },
        formOrder: [
            '/sequenceNumber',

            ...asPointers(Object.keys(definitions)),

            '/scientific/state/comment',
        ]
    })
    
    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Cats',
            'de': 'Katzen',
        },
        requiresTestingPermissions: false,
        showOnlineId: false,
        showSequenceNumber: true,
        commentFieldIsSensitive: false,
    });

    return crt.meta._id;
}

var FieldDefinitions = ({ cache }) => ({

    'name': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'name',
        displayName: 'Name',
        displayNameI18N: { 'de': 'Name' },
        props: { minLength: 1 }
    },
    
    /////////////////////////////////////////////////////////////////
   
    'dateOfBirth': {
        __subChannelKey: 'scientific',
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        props: { isNullable: true, isSpecialAgeFrameField: true }
    },
   
    'sex': {
        __subChannelKey: 'scientific',
        type: 'BiologicalGender',
        key: 'sex',
        displayName: 'Sex',
        displayNameI18N: { 'de': 'Geschlecht' },
        props: {
            enableUnknownValue: true,
            enableOtherValue: false,
        }
    },

    'ownerIds': {
        __subChannelKey: 'scientific',
        type: 'ForeignIdList',
        key: 'ownerIds',
        displayName: 'Owners',
        displayNameI18N: { de: 'Besitzer:innen' },
        props: {
            collection: 'subject',
            recordType: 'catOwner',
            minItems: 0,
            readOnly: false,
            addReferenceToTarget: true,
            targetReferenceField: (
                '/scientific/state/custom/knownCatIds'
            ),
            constraints: {},
        },
    },
    
    'motherId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'motherId',
        displayName: 'Mother',
        displayNameI18N: { de: 'Mutter' },
        props: {
            collection: 'subject',
            recordType: 'cat',
            isNullable: true,
            displayEmptyAsUnknown: true,
            addReferenceToTarget: true,
            targetReferenceField: (
                '/scientific/state/custom/knownOffspringIds'
            ),
            constraints: {
                '/scientific/state/custom/sex': 'female',
            },
        },
    },

    'fatherId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'fatherId',
        displayName: 'Father',
        displayNameI18N: { de: 'Vater' },
        props: {
            collection: 'subject',
            recordType: 'cat',
            isNullable: true,
            displayEmptyAsUnknown: true,
            addReferenceToTarget: true,
            targetReferenceField: (
                '/scientific/state/custom/knownOffspringIds'
            ),
            constraints: {
                '/scientific/state/custom/sex': 'male',
            },
        },
    },

    'knownOffspringIds': {
        __subChannelKey: 'scientific',
        type: 'ForeignIdList',
        key: 'knownOffspringIds',
        displayName: 'Known Offspring',
        displayNameI18N: { de: 'Bekannte Nachkommen' },
        props: {
            collection: 'subject',
            recordType: 'cat',
            minItems: 0,
            readOnly: true,
            constraints: {},
        },
    },
    
    'catShelterId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'catShelterId',
        displayName: 'Cat Shelter',
        displayNameI18N: { de: 'Tierheim' },
        props: {
            collection: 'location',
            recordType: 'catShelter',
            isNullable: true,
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            constraints: {},
        },
    },
    
    'groupId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'groupId',
        displayName: 'Group',
        displayNameI18N: { de: 'Gruppe' },
        props: {
            collection: 'subjectGroup',
            isNullable: true,
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            constraints: {
                '/subjectType': 'cat',
                '/state/locationId': '$data:/scientific/state/custom/locationId'
            },
        },
    },
    
    'rearingHistoryId': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemId',
        key: 'rearingHistoryId',
        displayName: 'Rearing History',
        displayNameI18N: { de: 'Aufzucht' },
        props: {
            setId: cache.get('/helperSet/cat_rearingHistory'),
            isNullable: true,
            displayEmptyAsUnknown: true,
        },
    },
    
    'shelterArrivalDate': {
        __subChannelKey: 'scientific',
        type: 'DateOnlyServerSide',
        key: 'shelterArrivalDate',
        displayName: 'Shelter Arrival',
        displayNameI18N: { de: 'Heim-Ankunft Am' },
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },

    'isSterilized': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'isSterilized',
        displayName: 'Is Sterilized',
        displayNameI18N: { de: 'Ist Sterilisiert' },
        props: {}
    },
    
    'wasFound': {
        __subChannelKey: 'scientific',
        type: 'DefaultBool',
        key: 'wasFound',
        displayName: 'Was Found',
        displayNameI18N: { de: 'Wurde Gefunden' },
        props: {}
    },
})
