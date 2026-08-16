'use strict';
var systemPermissionsSchema
    = require('../../common/system-permissions-schema');

var {
    ExactObject, ClosedObject, MaxObject,
    ForeignId, DefaultBool, SaneString,
} = require('@mpieva/psydb-schema-fields');

var PersonnelScientificState = (bag) => {
    var { extraOptions = {} } = bag;
    var {
        enableCanLogIn = false,
        enableHasRootAccess = false,
    } = extraOptions;

    var required = {
        ...(enableCanLogIn && { 'canLogIn': DefaultBool() }),
        ...(enableHasRootAccess && { 'hasRootAccess': DefaultBool() }),

        'systemPermissions': systemPermissionsSchema,
        'researchGroupSettings': {
            systemType: 'PersonnelResearchGroupSettingsList',
            type: 'array',
            default: [],
            items: ClosedObject({
                'researchGroupId': ForeignId({ collection: 'researchGroup' }),
                'systemRoleId': ForeignId({ collection: 'systemRole' })
            })
        },
    }

    var optional = {
        'manualImportId': SaneString(),
        'internals': MaxObject({
            'forcedResearchGroup': ForeignId({
                collection: 'researchGroup'
            })
        }),
    }

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required),
    })

    return schema;
};

module.exports = PersonnelScientificState;
