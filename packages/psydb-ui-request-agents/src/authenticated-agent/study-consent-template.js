'use strict';

var studyConsentTemplateRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        read: dumpPOST({ url: '/api/study-consent-template/read' }),

        list: ({ filters, ...pass }) => (
            dumpPOST({ url: '/api/study-consent-template/list' })({
                quicksearch: filters, ...pass
            })
        ),
    }
}

module.exports = studyConsentTemplateRequests;
