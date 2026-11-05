import { useUIConfig } from '@mpieva/psydb-ui-contexts';
import { createFieldDefaults } from '@mpieva/psydb-ui-lib';

const {
    Custom,
    SystemPermissions
} = createFieldDefaults;

export const createDefaults = (options) => {
    var { fieldDefinitions, permissions } = options;
    var { dev_enableWKPRCPatches, dev_enableStudyRoadmap } = useUIConfig();

    return {
        runningPeriod: { end: null },
        enableFollowUpExperiments: false,
        researchGroupIds: [ null ],
        scientistIds: [ null ],
        studyTopicIds: [],
        custom: Custom({ fieldDefinitions }),
        systemPermissions: SystemPermissions({ permissions }),

        ...(dev_enableWKPRCPatches && {
            experimentNames: [ '' ]
        }),
        ...(dev_enableStudyRoadmap && {
            studyRoadmap: { props: { tasks: [] }}
        })
    }
}
