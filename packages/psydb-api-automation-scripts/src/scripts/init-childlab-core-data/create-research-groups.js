'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;

    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: `Lueneluetten`,
            shorthand: `Lueneluetten`,
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
                'inhouse',
                'away-team',
            ],
            studyTypes: [
                { key: 'lueneluettenStudy' },
            ],
            subjectTypes: [
                { key: 'children' },
            ],
            locationTypes: [
                { key: 'instituteroom' },
                { key: 'kiga' },
            ],
            helperSetIds: [
                cache.get('/helperSet/language'),
            ],
            systemRoleIds: [
                cache.get('/systemRole/RA'),
                cache.get('/systemRole/Scientist'),
                cache.get('/systemRole/Hiwi'),
                cache.get('/systemRole/Reception'),
            ],
            adminFallbackRoleId: (
                cache.get('/systemRole/RA')
            ),
        }},
    });

    cache.addId({ collection: 'researchGroup', as: 'Lueneluetten' });
}

