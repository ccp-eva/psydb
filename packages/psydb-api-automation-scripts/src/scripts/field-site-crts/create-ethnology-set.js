'use strict';

var createEthnologySet = async ({ apiKey, driver, site }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: { label: `FS ${site.label} Ethnie` }},
    }, { apiKey })
    return driver.getCache().lastChannelIds['helperSet'];
}

module.exports = createEthnologySet;



