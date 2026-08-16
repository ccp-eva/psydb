'use strict';

var experimentRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        listPostprocessing: dumpPOST({
            url: '/api/experiment/list-postprocessing'
        }),
    }
}

module.exports = experimentRequests;
