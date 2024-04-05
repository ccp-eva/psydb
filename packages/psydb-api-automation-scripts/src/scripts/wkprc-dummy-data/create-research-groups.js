'use strict';

module.exports = async (context) => {
    var { driver, apiKey, cache } = context;

    var toTypeItems = (keys) => keys.map(it => ({
        key: it, id: cache.get(`/customRecordType/${it}`)
    }));

    var toSetIds = (labels) => labels.map(it => (
        cache.get(`/helperSet/${it}`)
    ));

    await driver.sendMessage({
        type: 'researchGroup/create',
        payload: { props: {
            name: 'WKPRC',
            shorthand: 'WKPRC',
            address: {
                affix: '',
                housenumber: '',
                street: '',
                city: '',
                postcode: '',
                country: 'DE',
            },
            description: '',

            studyTypes: toTypeItems([
                'wkprc_study'
            ]),
            subjectTypes: toTypeItems([
                'wkprc_chimpanzee',
                'wkprc_bonobo',
                'wkprc_gorilla',
                'wkprc_orang_utan',
            ]),
            locationTypes: toTypeItems([
                'wkprc_ape_location'
            ]),
            helperSetIds: toSetIds([
                'WKPRC Chimpanzee Sub-Species',
                'WKPRC Bonobo Sub-Species',
                'WKPRC Gorilla Sub-Species',
                'WKPRC Orang-Utan Sub-Species',
                'WKPRC Origin',
                'WKPRC Rearing History',
            ]),
            labMethods: [
                'apestudies-wkprc-default'
            ],
        }},
    }, { apiKey });

    cache.addId({ collection: 'researchGroup', as: 'WKPRC' });
}

