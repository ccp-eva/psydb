'use strict';
var { PointerGen } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var displayNames = {
        'en': 'Uganda Subjects',
        'de': 'Uganda Proband:innen',
    };

    var crt = await driver.crt.create({
        displayNames,
        collection: 'subject', key: 'fs_uganda_subject',
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
        displayNames,
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
   
    'localId': {
        __subChannelKey: 'scientific',
        type: 'SaneString',
        key: 'localId',
        displayName: 'Local ID',
        displayNameI18N: { 'de': 'Local ID' },
        props: { minLength: 1 }
    },

    'dateOfBirth': {
        __subChannelKey: 'scientific',
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        props: { isNullable: true, isSpecialAgeFrameField: true }
    },
    
    'isDateOfBirthReliable': {
        __subChannelKey: 'scientific',
        type: 'DefaultBool',
        key: 'isDateOfBirthReliable',
        displayName: 'Date of Birth Reliable',
        displayNameI18N: { de: 'Geburtsdatum gesichert' },
        props: {},
    },
   
   'biologicalGender' : {
        __subChannelKey: 'scientific',
        type: 'BiologicalGender',
        key: 'biologicalGender',
        displayName: 'Gender',
        displayNameI18N: { 'de': 'Geschlecht' },
        props: {
            enableUnknownValue: true,
            enableOtherValue: false,
        }
    },
    
    'villageId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'villageId',
        displayName: 'Village',
        displayNameI18N: { de: 'Dorf' },
        props: {
            collection: 'location',
            recordType: 'fs_uganda_village',
            isNullable: true,
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            constraints: {},
        },
    },
    
    'schoolId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'schoolId',
        displayName: 'School',
        displayNameI18N: { de: 'Schule' },
        props: {
            collection: 'location',
            recordType: 'fs_uganda_school',
            isNullable: true,
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            constraints: {},
        },
    },

    'acquiredBy': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'acquiredBy',
        displayName: 'Acquired by',
        displayNameI18N: { de: 'Akquiriert durch' },
        props: {
            collection: 'personnel',
            isNullable: false,
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
            constraints: {},
        },
    },

    'dateOfConsentForm': {
        __subChannelKey: 'scientific',
        type: 'DateOnlyServerSide',
        key: 'dateOfConsentForm',
        displayName: 'Date of Consent Form',
        displayNameI18N: { de: 'Datum Einwilligungserklärung' },
        props: { isNullable: true, isSpecialAgeFrameField: false }
    },

    'schoolClassAtAcquisiton': {
        __subChannelKey: 'scientific',
        type: 'SaneString',
        key: 'schoolClassAtAcquisition',
        displayName: 'School Class at Acquisition',
        displayNameI18N: { 'de': 'Schulklasse bei Akquise' },
        props: { minLength: 0 }
    },
 
    'parentIds': {
        __subChannelKey: 'scientific',
        type: 'ForeignIdList',
        key: 'parentIds',
        displayName: 'Parents',
        displayNameI18N: { de: 'Eltern' },
        props: {
            collection: 'subject',
            recordType: 'uganda_subject',
            minItems: 0,
            readOnly: false,
            addReferenceToTarget: true,
            targetReferenceField: (
                '/scientific/state/custom/knownChildrenIds'
            ),
            constraints: {},
        },
    },
    

    'knownChildrenIds': {
        __subChannelKey: 'scientific',
        type: 'ForeignIdList',
        key: 'knownChildrenIds',
        displayName: 'Known Children',
        displayNameI18N: { de: 'Bekannte Kinder' },
        props: {
            collection: 'subject',
            recordType: 'uganda_subject',
            minItems: 0,
            readOnly: true,
            constraints: {},
        },
    },
    
    
    'ethnicityIds': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemIdList',
        key: 'ethnicityIds',
        displayName: 'Ethnicities',
        displayNameI18N: { de: 'Ethnien' },
        props: {
            setId: cache.get('/helperSet/fs_uganda_ethnicity'),
            minItems: 0,
        },
    },

    'languageIds': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemIdList',
        key: 'languageIds',
        displayName: 'Languages',
        displayNameI18N: { de: 'Sprachen' },
        props: {
            setId: cache.get('/helperSet/fs_uganda_language'),
            minItems: 0,
        },
    },
    
})
