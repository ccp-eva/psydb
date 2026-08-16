'use strict';

var locationRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        extendedSearch: dumpPOST({ url: '/api/location/extended-search' }),
    }
}

module.exports = locationRequests;
