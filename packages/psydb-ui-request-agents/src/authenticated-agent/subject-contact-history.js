'use strict';

var subjectContactHistoryRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        list: dumpPOST({ url: '/api/subject-contact-history/list' }),
    }
}

module.exports = subjectContactHistoryRequests;
