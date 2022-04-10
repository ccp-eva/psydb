import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

export const createDefaults = (options) => {
    var { fieldDefinitions, permissions } = options;
    return {
        runningPeriod: {},
        enableFollowUpExperiments: false,
        researchGroupIds: [],
        scientistIds: [],
        studyTopicIds: [],
        custom: Custom({ fieldDefinitions }),
        systemPermissions: SystemPermissions({ permissions }),
    }
}
