export const createDefaults = (options) => {
    return {
        subjectsAreTestedTogether: true,
        subjectData: [
            {
                status: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            }
        ]
    }
}
