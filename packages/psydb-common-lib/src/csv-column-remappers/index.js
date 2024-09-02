'use strict'
module.exports = {
    SubjectDefault: require('./subject'),
    Experiment: {
        WKPRCApestudiesDefault: (
            require('./experiment/wkprc-apestudies-default')
        ),
        OnlineSurvey: (
            require('./experiment/online-survey')
        ),
        ManualOnlyParticipation: (
            require('./experiment/manual-only-participation')
        ),
    },
}
