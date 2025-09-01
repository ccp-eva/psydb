'use strict';

var read = async (bag) => {
    var {
        driver,
        crtId = undefined, collection = undefined, type = undefined,
        raw = false,
    } = bag;

    var response = undefined;
    if (raw) {
        response = await driver.get({
            url: `/read/customRecordType/${crtId}`
        });
    }
    else {
        response = await driver.get({
            url: `/metadata/crt-settings/${collection}/${type}`
        });
    }
    
    return response.data.data;
}

module.exports = list;
