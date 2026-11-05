import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const { SystemPermissions } = createFieldDefaults;

export const createDefaults = (options) => {
    var { permissions } = options;

    return {
        isEnabled: false,
        mailHTML: '',
        mailText: '',
        mailLinks: [],
        mailAttachments: [],
        systemPermissions: SystemPermissions({ permissions }),
    }
}
