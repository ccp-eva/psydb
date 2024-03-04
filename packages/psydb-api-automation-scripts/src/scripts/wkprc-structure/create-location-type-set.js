'use strict';

module.exports = async ({ apiKey, driver, cache, as }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: { label: 'WKPRC Location Type' }},
    }, { apiKey });

    cache.addId({ collection: 'helperSet', as });
}


