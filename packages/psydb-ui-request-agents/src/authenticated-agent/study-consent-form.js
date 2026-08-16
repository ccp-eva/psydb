'use strict';

var studyConsentFormRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        read: dumpPOST({ url: '/api/study-consent-form/read' }),
        list: dumpPOST({ url: '/api/study-consent-form/list' }),
    }
}

module.exports = studyConsentFormRequests;
