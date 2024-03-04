'use strict';

module.exports = async ({ apiKey, driver, cache, as }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: {
            label: 'Acquisition',
            displayNameI18N: { 'de': 'Akquise' }
        }},
    }, { apiKey });

    cache.addId({ collection: 'helperSet', as });
}


