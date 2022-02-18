import { createFieldDefaults } from '@mpieva/psydb-ui-lib';
const { SystemPermissions } = createFieldDefaults;

export const createDefaults = (options) => {
    var { permissions } = options;
    return {
        gdpr: {
            firstname: '',
            lastname: '',
            shorthand: '',
            emails: [{ isPrimary: false }],
            phones: [],
        },
        scientific: {
            researchGroupSettings: [{}],
            systemPermissions: SystemPermissions({ permissions }),
            canLogIn: false,
            hasRootAccess: false,
        }
    }
}
