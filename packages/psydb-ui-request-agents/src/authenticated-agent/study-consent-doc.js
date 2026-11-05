'use strict';

var studyConsentDocRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        read: dumpPOST({ url: '/api/study-consent-doc/read' }),
        list: dumpPOST({ url: '/api/study-consent-doc/list' }),
        
        readByExperimentAndSubject: dumpPOST({
            url: '/api/study-consent-doc/read-by-experiment-and-subject'
        }),
    }
}

module.exports = studyConsentDocRequests;
