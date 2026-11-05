'use strict';

var experimentRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        listPostprocessing: dumpPOST({
            url: '/api/experiment/list-postprocessing'
        }),
        extendedSearch: dumpPOST({
            url: '/api/experiment/extended-search'
        }),
    }
}

module.exports = experimentRequests;
