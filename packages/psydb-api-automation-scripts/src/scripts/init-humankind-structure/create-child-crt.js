'use strict';
var PointerGen = require('./pointer-gen');

module.exports = async (context) => {
    var { driver, cache, as } = context;

    var definitions = FieldDefinitions({ cache });
    var asPointers = PointerGen(definitions);

    var crt = await driver.crt.create({
        collection: 'subject', key: 'humankindChild',
        displayNames: {
            'en': 'Humankind Children',
            'de': 'Humankind Kinder',
        }
    });

    cache.addCRT(crt.meta);
    var { _id: crtId } = crt.meta;

    await crt.addManyFields({ definitions: Object.values(definitions) });
    await crt.commitFields();

    await crt.setupDisplaySettings({
        recordLabelDefinition: {
            format: '${#}, ${#} (${#})',
            tokens: asPointers([ 'lastname', 'firstname', 'gender' ])
        },
        displayFields: {
            'table': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname', 'gender', 'dateOfBirth'
            ])],
            'optionlist': [ '/sequenceNumber', ...asPointers([
                'lastname', 'firstname', 'gender', 'dateOfBirth'
            ])],
        },
        formOrder: [
            '/sequenceNumber',
            '/onlineId',

            ...asPointers(Object.keys(definitions)),

            '/scientific/state/testingPermissions',
            '/scientific/state/comment',
        ]
    })

    await driver.sendMessage({
        type: 'custom-record-types/set-duplicate-check-settings',
        payload: { id: crtId, fieldSettings: [
            { pointer: '/gdpr/state/custom/firstname', props: {}},
            { pointer: '/gdpr/state/custom/lastname', props: {}} ,
        ]}
    });
    
    await crt.updateGeneralSettings({
        displayNames: {
            'en': 'Humankind Children',
            'de': 'Humankind Kinder',
        },
        requiresTestingPermissions: true,
        showOnlineId: true,
        showSequenceNumber: true,
        commentFieldIsSensitive: false,
    });

    return crtId;
}

var FieldDefinitions = ({ cache }) => ({
    'lastname': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'lastname',
        displayName: 'Lastname',
        displayNameI18N: { 'de': 'Nachname' },
        props: { minLength: 1 }
    },

    'firstname': {
        __subChannelKey: 'gdpr',
        type: 'SaneString',
        key: 'firstname',
        displayName: 'Firstname',
        displayNameI18N: { 'de': 'Vorname' },
        props: { minLength: 1 }
    },

    'gender': {
        __subChannelKey: 'gdpr',
        type: 'BiologicalGender',
        key: 'gender',
        displayName: 'Gender',
        displayNameI18N: { 'de': 'Geschlecht' },
        props: {
            enableUnknownValue: false,
            enableOtherValue: true,
        }
    },

   
    'dateOfBirth': {
        __subChannelKey: 'gdpr',
        type: 'DateOnlyServerSide',
        key: 'dateOfBirth',
        displayName: 'Date of Birth',
        displayNameI18N: { 'de': 'Geburtsdatum' },
        props: { isNullable: false, isSpecialAgeFrameField: true }
    },
    
    ///////////////////////////////////////////////
   
    'siblingCount': {
        __subChannelKey: 'scientific',
        type: 'Integer',
        key: 'siblingCount',
        displayName: 'Siblings',
        displayNameI18N: { 'de': 'Geschwister' },
        props: { minimum: 0, isNullable: true },
    },

    'parentIds': {
        __subChannelKey: 'scientific',
        type: 'ForeignIdList',
        key: 'parentIds',
        displayName: 'Parents',
        displayNameI18N: { 'de': 'Eltern' },
        props: {
            collection: 'subject',
            recordType: 'humankindAdult',
            minItems: 0,
            addReferenceToTarget: true,
            readOnly: false,
            targetReferenceField: (
                '/scientific/state/custom/knownChildrenIds'
            ),
            constraints: {},
        },
    },

    'nativeLanguageId': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemId',
        key: 'nativeLanguageId',
        displayName: 'Native Language',
        displayNameI18N: { 'de': 'Muttersprache' },
        props: {
            setId: cache.get('/helperSet/language'),
            isNullable: true,
            displayEmptyAsUnknown: false,
        },
    },

    'otherLanguageIds': {
        __subChannelKey: 'scientific',
        type: 'HelperSetItemIdList',
        key: 'otherLanguageIds',
        displayName: 'Other Languages',
        displayNameI18N: { 'de': 'Weitere Sprachen' },
        props: {
            setId: cache.get('/helperSet/language'),
            minItems: 0,
        },
    },

    'kigaId': {
        __subChannelKey: 'scientific',
        type: 'ForeignId',
        key: 'kigaId',
        displayName: 'Kindergarden',
        displayNameI18N: { 'de': 'Kindergarten' },
        props: {
            collection: 'location',
            recordType: 'kiga',
            isNullable: true,
            readOnly: false,
            constraints: {},
            displayEmptyAsUnknown: false,
            addReferenceToTarget: false,
        },
    },

    'doesDBRegistrationConsentOnPaperExist': {
        __subChannelKey: 'scientific',
        type: 'DefaultBool',
        key: 'doesDBRegistrationConsentOnPaperExist',
        displayName: 'DB-Consent (Paper)',
        displayNameI18N: { 'de': 'DB-Einverständnis (Papier)' },
        props: {}
    },
     
    'canParticipateInStudiesWithHealthyChildren': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'canParticipateInStudiesWithHealthyChildren',
        displayName: (
            'Can participate in studies with children that are healthy, born on schedule and developed age appropriatly?'
        ),
        displayNameI18N: { 'de': (
            'Kann an Studien mit gesunden, termingerecht gebohrenen und altersgerecht entwickelten Kindern teilnehmen?'
        )},
        props: {}
    },

    'allowedToEat': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'allowedToEat',
        displayName: 'Allowed to Eat',
        displayNameI18N: { 'de': 'Ess-Erlaubnis' },
        props: {}
    },
    
    'hasAwayTeamTestingPermissionForNextYear': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'hasAwayTeamTestingPermissionForNextYear',
        displayName: 'Kiga-Consent for Next Year',
        displayNameI18N: { 'de': 'Kiga-Erlaubnis im Folgejahr' },
        props: {}
    },

    'didConsentToStayInDBAsAdult': {
        __subChannelKey: 'scientific',
        type: 'ExtBool',
        key: 'didConsentToStayInDBAsAdult',
        displayName: 'Consent to Adult-DB',
        displayNameI18N: { 'de': 'Zustimmung zu Erachsenen-DB' },
        props: {}
    }
})
