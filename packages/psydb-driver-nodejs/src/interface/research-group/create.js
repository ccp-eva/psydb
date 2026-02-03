'use strict';

var create = async (bag) => {
    var { driver, data = {}} = bag;

    var props = data.state;

    await driver.sendMessage({
        type: `researchGroup/create`,
        payload: { props: props }
    });
    
    var recordId = driver.getCache().lastChannelIds['researchGroup'];

    return {
        meta: { _id: recordId }
    }
}

module.exports = create;
