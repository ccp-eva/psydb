export const createDefaults = (options) => {
    return {
        subjectsAreTestedTogether: false,
        subjectData: [
            {
                status: 'participated',
                excludeFromMoreExperimentsInStudy: false,
            }
        ],
        labOperatorIds: [ null ],
        studyTopicIds: [ null ],
    }
}
