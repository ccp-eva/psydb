'use strict';

var read = async (bag) => {
    var { driver, crtId } = bag;

    var response = await driver.get({
        url: `/read/customRecordType/${crtId}`
    });
    
    return response.data.data;
}

module.exports = read;
