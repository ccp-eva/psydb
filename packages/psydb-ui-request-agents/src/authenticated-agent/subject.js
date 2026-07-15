'use strict';

var subjectRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        listDuplicates: dumpPOST({ url: '/api/subject/listDuplicates' }),
        extendedSearch: dumpPOST({ url: '/api/extended-search/subjects' }),
    }
}

module.exports = subjectRequests;
