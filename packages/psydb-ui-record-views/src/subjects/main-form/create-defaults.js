import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

export const createDefaults = (options) => {
    var {
        fieldDefinitions,
        requiresTestingPermissions,
        permissions
    } = options;

    return {
        gdpr: {
            custom: Custom({
                fieldDefinitions,
                subChannelKey: 'gdpr',
                permissions,
            }),
        },
        scientific: {
            custom: Custom({
                fieldDefinitions,
                subChannelKey: 'scientific',
                permissions,
            }),
            ...(requiresTestingPermissions && {
                testingPermissions: [],
            }),
            systemPermissions: SystemPermissions({
                permissions, noPreset: permissions.isRoot() ? true : false
            }),
            comment: '',
        }
    }
}
