'use strict';

var helperSetItemRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        list: dumpPOST({ url: '/api/helperSetItem/list' }),
    }
}

module.exports = helperSetItemRequests;
