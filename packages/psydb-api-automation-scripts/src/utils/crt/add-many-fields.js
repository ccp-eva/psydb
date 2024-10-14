'use strict';
var addManyFields = async (bag) => {
    var { driver, crtId, subChannelKey, definitions } = bag;

    for (var def of definitions) {
        var { __subChannelKey, ...realDef } = def;
        await driver.sendMessage({
            type: 'custom-record-types/add-field-definition',
            payload: {
                id: crtId,
                subChannelKey: __subChannelKey || subChannelKey,
                props: realDef
            }
        })
    }
}

module.exports = addManyFields;
