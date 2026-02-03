'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;

    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: 'Field-Site Uganda',
            shorthand: 'FS Uganda',
            address: {
                affix: '',
                housenumber: '',
                street: '',
                city: '',
                postcode: '',
                country: 'DE',
            },
            description: '',

            labMethods: [
                'manual-only-participation'
            ],
            studyTypes: [
                { key: 'default' },
            ],
            subjectTypes: [
                { key: 'fs_uganda_subject' },
            ],
            locationTypes: [
                { key: 'fs_uganda_village' },
                { key: 'fs_uganda_school' },
            ],
            helperSetIds: [
                cache.get('/helperSet/Uganda Ethnicity'),
                cache.get('/helperSet/Uganda Language'),
            ],
            systemRoleIds: [
                cache.get('/systemRole/fs_uganda_scientist'),
            ],
            adminFallbackRoleId: (
                cache.get('/systemRole/fs_uganda_scientist')
            ),
        }},
    });
    cache.addId({ collection: 'researchGroup', as: 'fs_uganda' });
}

