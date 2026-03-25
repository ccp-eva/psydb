'use strict';
 var { SubjectSelectionSettingsList, SystemPermissions }
    = require('@mpieva/psydb-schema-fields-special');
var { CustomProps } = require('../../common');

var {
    ExactObject,
    DefaultArray,
    DefaultBool,
    ForeignId,
    ForeignIdList,

    SaneString,
    SaneStringList,
    DateOnlyServerSideInterval,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var StudyState = (bag = {}) => {
    var {
        apiConfig,
        crtSettings,

        customFieldDefinitions, // FIXME: make obsolete
        enableInternalProps,
    } = bag;

    // FIXME: make obsolete
    if (crtSettings) {
        customFieldDefinitions = studyCRTSettings.allCustomFields();
    }

    var { dev_enableWKPRCPatches: IS_WKPRC } = apiConfig;

    var required = {
        'name': SaneString({ minLength: 1 }),
        'shorthand': SaneString({ minLength: 1 }),
        'runningPeriod': DateOnlyServerSideInterval({
            required: [ 'start', 'end' ],
            additionalEndKeywords: { isNullable: true },
        }),
        'researchGroupIds': ForeignIdList({
            minItems: 1, collection: 'researchGroup',
        }),
        'custom': CustomProps({ customFieldDefinitions }),
        'systemPermissions': SystemPermissions(),
    }

    var optional = {
        'scientistIds': ForeignIdList({
            collection: 'personnel', minItems: 1,
        }),
        'studyTopicIds': ForeignIdList({
            collection: 'studyTopic', minItems: 0,
        }),
        'excludedOtherStudyIds': ForeignIdList({
            collection: 'study', minItems: 0,
        }),

        // TODO: move to labProcedureSettings
        'enableFollowUpExperiments': DefaultBool(),
    }

    if (IS_WKPRC) {
        delete required.shorthand;
        required['experimentNames'] = SaneStringList({ minItems: 1 });
    }

    var compat = _COMPAT_PROPS({ enableInternalProps });

    var schema = ExactObject({
        properties: {
            ...required,
            ...optional,
            ...compat
        },
        required: [
            ...Object.keys(required),
            ...(enableInternalProps ? [ 'internals' ] : []),
        ],
    });

    return schema;
};

var _COMPAT_PROPS = ({ enableInternalProps }) => ({
    ...(enableInternalProps && {
        // TODO: remove this property
        // we currently just keep it around to
        // not need to update the database
        'isCreateFinalized': DefaultBool({ default: true}),
    }),

    // TODO: obsolete
    inhouseTestLocationSettings: DefaultArray({
        systemType: 'InhouseTestLocationSettings',
        items: ExactObject({
            systemType: 'InhouseTestLocationSettingsItem',
            properties: {
                customRecordType: CustomRecordTypeKey({
                    collection: 'location',
                }),
                enabledLocationIds: ForeignIdList({
                    collection: 'location',
                    // TODO: record type $data ??
                })
            },
            required: [
                'customRecordType',
                'enabledLocationIds',
            ]
        })
    }),

    // FIXME: should probably be in internals
    // TODO: obsolete
    selectionSettingsBySubjectType: { type: 'array' },
    
    ...(enableInternalProps && {
        interals: { // XXX: sic
            type: 'object',
            properties: {},
            required: [
                'excludedOtherStudyIds', // FIXME: what?
            ],
        },
    })
})

module.exports = StudyState;
