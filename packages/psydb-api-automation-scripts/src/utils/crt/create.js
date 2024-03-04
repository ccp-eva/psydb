'use strict';
var addManyFields = require('./add-many-fields');
var setupDisplaySettings = require('./setup-display-settings');
var commitFields = require('./commit-fields');
var updateGeneralSettings = require('./update-general-settings');

var create = async (bag) => {
    var { driver, collection, key, displayNames } = bag;
    var { en, ...i18n } = displayNames;

    await driver.sendMessage({
        type: `custom-record-types/create`,
        payload: {
            collection: 'subject',
            type: key,
            props: {
                label: en,
                displayNameI18N: i18n
            }
        },
    });

    var crtId = driver.getCache().lastChannelIds['customRecordType'];

    return {
        meta: { _id: crtId, key, collection },

        addManyFields: (bag) => (
            addManyFields({ driver, crtId, ...bag })
        ),
        setupDisplaySettings: (bag) => (
            setupDisplaySettings({ driver, crtId, ...bag })
        ),
        commitFields: (bag) => (
            commitFields({ driver, crtId, ...bag })
        ),
        updateGeneralSettings: (bag) => (
            updateGeneralSettings({ driver, crtId, ...bag })
        ),
    }
}

module.exports = create;
