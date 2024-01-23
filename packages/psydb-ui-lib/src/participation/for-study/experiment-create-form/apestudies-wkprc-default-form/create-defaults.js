export const createDefaults = (options = {}) => {
    var {
        preselectedSubjectId = undefined,
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
                comment: '',
                status: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            }
        ],
        roomOrEnclosure: '',
        labOperatorIds: [ null ],
    }
}
