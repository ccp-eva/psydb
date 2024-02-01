'use strict';

var createResearchGroup = async ({ apiKey, driver, site }) => {
    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: `Field-Site ${site.labelEN}`,
            shorthand: `FS ${site.labelEN}`,
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

    return driver.getCache().lastChannelIds['researchGroup'];
}

module.exports = createResearchGroup;



