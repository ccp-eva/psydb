'use strict';
var create = async (bag) => {
    var { driver, displayNames } = bag;
    var { en, ...i18n } = displayNames;
    
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: {
            label: en,
            displayNameI18N: i18n
        }},
    });

    var setId = driver.getCache().lastChannelIds['helperSet'];

    return {
        meta: { _id: setId }
    }
}

module.exports = create;
