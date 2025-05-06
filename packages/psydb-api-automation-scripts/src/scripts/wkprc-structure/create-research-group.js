'use strict';

module.exports = async (context) => {
    var { driver, cache } = context;

    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: `WKPRC`,
            shorthand: `WKPRC`,
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
                'apestudies-wkprc-default',
            ],
            studyTypes: [
                { key: 'wkprc_study' },
            ],
            subjectTypes: [
                { key: 'wkprc_chimpanzee' },
                { key: 'wkprc_bonobo' },
                { key: 'wkprc_gorilla' },
                { key: 'wkprc_orangutan' },
            ],
            locationTypes: [
                { key: 'wkprc_apeLocation' },
            ],
            helperSetIds: [
                cache.get('/helperSet/wkprc_chimpanzeeSubSpecies'),
                cache.get('/helperSet/wkprc_bonoboSubSpecies'),
                cache.get('/helperSet/wkprc_gorillaSubSpecies'),
                cache.get('/helperSet/wkprc_orang_utanSubSpecies'),
                cache.get('/helperSet/wkprc_origin'),
                cache.get('/helperSet/wkprc_rearingHistory'),
            ],
            systemRoleIds: [
                cache.get('/systemRole/wkprc_ra'),
                cache.get('/systemRole/wkprc_scientist'),
            ],
            adminFallbackRoleId: (
                cache.get('/systemRole/wkprc_ra')
            ),
        }},
    });

    cache.addId({ collection: 'researchGroup', as: 'WKPRC' });
}

