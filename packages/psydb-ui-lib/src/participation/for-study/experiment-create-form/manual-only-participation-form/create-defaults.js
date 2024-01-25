export const createDefaults = (options = {}) => {
    var {
        preselectedSubjectId,
        subjectsAreTestedTogetherOverride = undefined,
    } = options;
    return {
        subjectsAreTestedTogether: (
            subjectsAreTestedTogetherOverride || false
        ),
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
