'use strict';
var { entries } = Object;

var create = async (bag) => {
    var { driver, data = {}} = bag;

    var props = {};
    for (var [ subChannel, subChannelData ] of entries(data)) {
        props[subChannel] = subChannelData?.state;
    }

    await driver.sendMessage({
        type: `personnel/create`,
        payload: { props: props }
    });
    
    var recordId = driver.getCache().lastChannelIds['personnel'];

    return {
        meta: { _id: recordId }
    }
}

module.exports = create;
