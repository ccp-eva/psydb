'use strict';

var settings = async (bag) => {
    var { driver, collection, type } = bag;

    var response = await driver.get({
        url: `/metadata/crt-settings/${collection}/${type}`
    });
    
    return response.data.data;
}

module.exports = settings;
