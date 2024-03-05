'use strict';
var setupCRTDisplaySettings = async (bag) => {
    var {
        driver, crtId,
        recordLabelDefinition,
        displayFields,
        formOrder
    } = bag;

    await driver.sendMessage({
        type: `custom-record-types/set-record-label-definition`,
        payload: { id: crtId, props: {
            ...recordLabelDefinition
        }}
    });

    for (var [target, fieldPointers] of Object.entries(displayFields)) {
        await driver.sendMessage({
            type: `custom-record-types/set-display-fields`,
            payload: { id: crtId, target, fieldPointers }
        });
    }

    if (formOrder) {
        await driver.sendMessage({
            type: `custom-record-types/set-form-order`,
            payload: { id: crtId, formOrder }
        });
    }
}

module.exports = setupCRTDisplaySettings;
