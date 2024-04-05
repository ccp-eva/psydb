'use strict';
var updateGeneralSettings = async (bag) => {
    var { driver, crtId, displayNames, ...pass } = bag;
    var { en, ...i18n } = displayNames;

    await driver.sendMessage({
        type: `custom-record-types/set-general-data`,
        payload: {
            id: crtId,
            label: en,
            displayNameI18N: i18n,
            ...pass
        }
    });
}

module.exports = updateGeneralSettings;
