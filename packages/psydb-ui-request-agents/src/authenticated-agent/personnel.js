'use strict';

var personnelRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        list: dumpPOST({ url: '/api/personnel/list' }),
        readManyLabels: dumpPOST({ url: '/api/personnel/read-many-labels' }),
    }
}

module.exports = personnelRequests;
