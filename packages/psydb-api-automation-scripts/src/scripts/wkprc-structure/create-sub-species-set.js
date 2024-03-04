'use strict';

module.exports = async ({ apiKey, driver, cache, type, label }) => {
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { props: { label: `WKPRC ${label} Sub-Species` }},
    }, { apiKey });

    cache.addId({ collection: 'helperSet', as: `${type}SubSpecies` });
}


