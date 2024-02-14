'use strict';

var createResearchGroup = async (bag) => {
    var { apiKey, driver, site, systemRoleId, ethnologySetId } = bag;

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
            studyTypes: [],
            subjectTypes: [
                { key: `fs_${site.type}_subject` },
            ],
            locationTypes: [
                { key: `fs_${site.type}_location` },
            ],
            helperSetIds: [
                ethnologySetId,
            ],
            systemRoleIds: [
                systemRoleId,
            ],
            labMethods: [
                'manual-only-participation'
            ]
        }},
    }, { apiKey });

    return driver.getCache().lastChannelIds['researchGroup'];
}

module.exports = createResearchGroup;



