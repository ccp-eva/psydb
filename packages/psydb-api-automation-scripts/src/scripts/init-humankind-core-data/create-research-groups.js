'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;

    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: `Humankind`,
            shorthand: `Humankind`,
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
                'online-video-call',
                'online-survey',
            ],
            studyTypes: [
                { key: 'humankindStudy' },
            ],
            subjectTypes: [
                { key: 'humankindAdult' },
                { key: 'humankindChild' },
            ],
            locationTypes: [
                { key: 'instituteroom' },
                { key: 'kiga' },
            ],
            helperSetIds: [
                cache.get('/helperSet/language'),
            ],
            systemRoleIds: [
                cache.get('/systemRole/Humankind RA'),
                cache.get('/systemRole/Humankind Scientist'),
                cache.get('/systemRole/Humankind Hiwi'),
                cache.get('/systemRole/Humankind Reception'),
            ],
            adminFallbackRoleId: (
                cache.get('/systemRole/Humankind RA')
            ),
        }},
    });

    cache.addId({ collection: 'researchGroup', as: 'Humankind' });
}

