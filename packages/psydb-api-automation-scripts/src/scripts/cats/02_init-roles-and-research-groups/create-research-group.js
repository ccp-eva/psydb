'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;

    await driver.researchGroup.create({ data: { state: {
        name: 'Center for Cat Research',
        shorthand: 'Cat-Lab',
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
            { key: 'catStudy' },
        ],
        subjectTypes: [
            { key: 'catOwner' },
            { key: 'cat' },
        ],
        locationTypes: [
            { key: 'instituteroom' },
            { key: 'catShelter' },
        ],
        helperSetIds: [
            cache.get('/helperSet/catOwner_acquisition'),
            cache.get('/helperSet/cat_rearingHistory'),
        ],
        systemRoleIds: [
            cache.get('/systemRole/cat_ra'),
            cache.get('/systemRole/cat_scientist'),
            cache.get('/systemRole/cat_reception'),
        ],
        adminFallbackRoleId: (
            cache.get('/systemRole/cat_ra')
        ),
    }}});

    cache.addId({ collection: 'researchGroup', as: 'catlab' });
}

