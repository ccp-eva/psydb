'use strict';

var createEthnologySet = async ({ apiKey, driver, site }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: {
            label: `${site.labelEN} Ethnology`,
            displayNameI18N: {
                de: `${site.labelDE} Ethnie`
            },
        }},
    }, { apiKey })
    return driver.getCache().lastChannelIds['helperSet'];
}

module.exports = createEthnologySet;



