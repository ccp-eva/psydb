'use strict';

var studyRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        read: dumpPOST({ url: '/api/study/read' }),
        list: dumpPOST({ url: '/api/study/list' }),
        readManyLabels: dumpPOST({ url: '/api/study/read-many-labels' }),
        relatedStudyConsentForms: dumpPOST({ url: '/api/study/related-study-consent-forms' }),
        
        extendedSearch: dumpPOST({ url: '/api/extended-search/studies' }),
    }
}

module.exports = studyRequests;
