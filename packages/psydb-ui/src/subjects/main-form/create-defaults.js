import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

export const createDefaults = (options) => {
    var { fieldDefinitions, permissions } = options;
    return {
        gdpr: {
            custom: Custom({ fieldDefinitions, subChannelKey: 'gdpr' }),
        },
        scientific: {
            custom: Custom({ fieldDefinitions, subChannelKey: 'scientific' }),
            testingPermissions: [],
            systemPermissions: SystemPermissions({ permissions }),
            comment: '',
        }
    }
}
