module.exports = {
    ExperimentCSV: {
        WKPRCApestudiesDefault: require('./evapecognition'),
        ...require('./experiment-csv'),
    },
    SubjectDefaultCSV: require('./subject-default'),
    ...require('./errors'),
}
