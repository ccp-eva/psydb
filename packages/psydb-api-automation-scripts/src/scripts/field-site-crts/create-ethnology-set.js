'use strict';

var createEthnologySet = async ({ apiKey, driver, site }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: {
            label: `FS ${site.labelEN} Ethnology`,
            displayNameI18N: {
                de: `FS ${site.labelDE} Ethnie`
            },
        }},
    }, { apiKey })
    return driver.getCache().lastChannelIds['helperSet'];
}

module.exports = createEthnologySet;



