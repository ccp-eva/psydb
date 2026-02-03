'use strict';
var { entries } = Object;

var create = async (bag) => {
    var { driver, type, data = {}} = bag;

    var { state: props, ...extra } = data;

    await driver.sendMessage({
        type: `externalOrganization/${type}/create`,
        payload: { props: props }
    });
    
    var recordId = driver.getCache().lastChannelIds['externalOrganization'];

    return {
        meta: { _id: recordId }
    }
}

module.exports = create;
