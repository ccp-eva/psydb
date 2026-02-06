'use strict';

var list = async (bag) => {
    var { driver } = bag;

    var response = await driver.post({ url: '/search/', payload: {
        collection: 'customRecordType', limit: 1000, offset: 0
    }});
    
    return response.data.data;
}

module.exports = list;
