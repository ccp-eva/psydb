'use strict';
var addManyFields = async (bag) => {
    var { driver, crtId, subChannelKey, definitions } = bag;

    for (var def of definitions) {
        await driver.sendMessage({
            type: 'custom-record-types/add-field-definition',
            payload: {
                id: crtId, subChannelKey,
                props: def
            }
        })
    }
}

module.exports = addManyFields;
