'use strict';

module.exports = async ({ apiKey, driver, cache, as }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: { label: 'Akquise/Funktion' }},
    }, { apiKey });

    cache.addId({ collection: 'helperSet', as });
}
