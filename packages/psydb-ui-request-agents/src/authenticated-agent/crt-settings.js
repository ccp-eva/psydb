'use strict';

var crtSettingsRequests = (bag) => {
    var { axios, dumpPOST } = bag;

    return {
        readMany: dumpPOST({
            url: '/api/crt-settings/read-many'
        }),
    }
}

module.exports = crtSettingsRequests;
