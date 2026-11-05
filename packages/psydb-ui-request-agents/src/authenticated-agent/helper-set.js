'use strict';

var helperSetRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        list: dumpPOST({ url: '/api/helperSet/list' }),
    }
}

module.exports = helperSetRequests;
