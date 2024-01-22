export const createDefaults = (options) => {
    return {
        subjectsAreTestedTogether: false,
        subjectData: [
            {
                comment: '',
                status: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            }
        ],
        roomOrEnclosure: '',
        labOperatorIds: [ null ],
    }
}
