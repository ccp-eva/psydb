'use strict';
var setupCRTDisplaySettings = (bag) => {
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

    for (var [target, tokens] of entries(displayFields)) {
        await driver.sendMessage({
            type: `custom-record-types/set-display-fields`,
            payload: { id: crtId, target, tokens }
        });
    }

    await driver.sendMessage({
        type: `custom-record-types/set-form-order`,
        payload: { id: crtId, formOrder }
    });
}

module.exports = setupCRTDisplaySettings;
