'use strict';

var create = async (bag) => {
    var { driver, type, data = {}} = bag;
    var { state, ...extra } = data;

    await driver.sendMessage({
        type: `study/${type}/create`,
        payload: { ...extra, props: state }
    });
    
    var recordId = driver.getCache().lastChannelIds['study'];

    return {
        meta: { _id: recordId }
    }
}

module.exports = create;
