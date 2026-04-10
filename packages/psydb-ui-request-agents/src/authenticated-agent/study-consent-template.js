'use strict';

var studyConsentTemplateRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        read: dumpPOST({ url: '/api/study-consent-template/read' }),
        list: dumpPOST({ url: '/api/study-consent-template/list' }),
    }
}

module.exports = studyConsentTemplateRequests;
