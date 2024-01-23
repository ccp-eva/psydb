export const createDefaults = (options = {}) => {
    var { preselectedSubjectId } = options;
    return {
        subjectsAreTestedTogether: false,
        subjectData: [
            {
                ...(preselectedSubjectId && {
                    subjectId: preselectedSubjectId,
                }),
                status: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            }
        ],
        labTeamId: null,
    }
}
