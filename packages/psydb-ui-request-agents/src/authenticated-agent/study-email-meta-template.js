'use strict';

var studyEmailMetaTemplateRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        read: dumpPOST({ url: '/api/study-email-meta-template/read' }),

        list: ({ filters, ...pass }) => (
            dumpPOST({ url: '/api/study-email-meta-template/list' })({
                quicksearch: filters, ...pass
            })
        ),
    }
}

module.exports = studyEmailMetaTemplateRequests;
