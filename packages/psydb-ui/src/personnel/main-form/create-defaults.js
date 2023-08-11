import { createFieldDefaults } from '@mpieva/psydb-ui-lib';
const { SystemPermissions } = createFieldDefaults;

export const createDefaults = (options) => {
    var { permissions } = options;
    return {
        gdpr: {
            firstname: '',
            lastname: '',
            emails: [{ isPrimary: true }],
            phones: [],
            description: '',
        },
        scientific: {
            researchGroupSettings: [{}],
            systemPermissions: SystemPermissions({ permissions }),
            ...(permissions.hasFlag('canAllowLogin') && {
                canLogIn: false,
            }),
            ...(permissions.isRoot() && {
                hasRootAccess: false,
            })
        }
    }
}
