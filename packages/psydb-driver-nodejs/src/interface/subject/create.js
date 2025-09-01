'use strict';

var create = async (bag) => {
    var { driver, type, data = {}} = bag;

    var props = {};
    for (var [ subChannel, subChannelData ] of entries(data)) {
        props[subChannel] = subChannelData?.state;
    }

    await driver.sendMessage({
        type: `subject/${type}/create`,
        payload: { props: props }
    });
    
    var recordId = driver.getCache().lastChannelIds['subject'];

    return {
        meta: { _id: recordId }
    }
}

module.exports = create;
