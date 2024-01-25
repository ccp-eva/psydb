export const createDefaults = (options = {}) => {
    var {
        preselectedSubject = undefined,
        subjectsAreTestedTogetherOverride = undefined,
    } = options;

    return {
        subjectsAreTestedTogether: (
            subjectsAreTestedTogetherOverride || false
        ),
        subjectData: [
            {
                ...(preselectedSubject && {
                    subjectId: preselectedSubject._id,
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
