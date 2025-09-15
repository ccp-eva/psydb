'use strict';
var { entries } = Object;

var create = async (bag) => {
    var { driver, type, data = {}} = bag;

    var { state: props, ...extra } = data;

    await driver.sendMessage({
        type: `location/${type}/create`,
        payload: { props: props }
    });
    
    var recordId = driver.getCache().lastChannelIds['location'];

    return {
        meta: { _id: recordId }
    }
}

module.exports = create;
