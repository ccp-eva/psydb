import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

export const createDefaults = (options) => {
    var { fieldDefinitions, permissions } = options;
    return {
        runningPeriod: { end: null },
        enableFollowUpExperiments: false,
        researchGroupIds: [ null ],
        scientistIds: [ null ],
        studyTopicIds: [],
        custom: Custom({ fieldDefinitions }),
        systemPermissions: SystemPermissions({ permissions }),
    }
}
