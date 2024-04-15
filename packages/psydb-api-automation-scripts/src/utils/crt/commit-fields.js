'use strict';
var commitFields = async (bag) => {
    var { driver, crtId } = bag;
    
    await driver.sendMessage({
        type: `custom-record-types/commit-settings`,
        payload: { id: crtId }
    });
}

module.exports = commitFields;
