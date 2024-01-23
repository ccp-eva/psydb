export const createDefaults = (options = {}) => {
    var { preselectedSubjectId } = options;
    return {
        subjectsAreTestedTogether: true,
        subjectData: [{
            ...(preselectedSubjectId && {
                subjectId: preselectedSubjectId,
            }),
            status: 'participated',
            excludeFromMoreExperimentsInStudy: false,
        }],
    }
}
