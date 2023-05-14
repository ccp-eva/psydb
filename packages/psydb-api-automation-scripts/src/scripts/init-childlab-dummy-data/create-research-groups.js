'use strict';

module.exports = async (context) => {
    var { driver, apiKey, cache } = context;

    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: `ChildLab`,
            shorthand: `ChildLab`,
            address: {
                affix: '',
                housenumber: '',
                street: '',
                city: '',
                postcode: '',
                country: 'DE',
            },
            description: '',
        }},
    }, { apiKey });

    cache.addId({ collection: 'researchGroup', as: 'ChildLab' });
}

