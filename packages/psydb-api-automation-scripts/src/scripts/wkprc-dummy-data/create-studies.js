'use strict';

// NOTE: lab teams and subject selection settings are disabled
// for wkprc_study, so we only need the experiment settings
var subjectTypes = [
    'wkprc_chimpanzee',
    'wkprc_bonobo',
    'wkprc_gorilla',
    'wkprc_orang_utan',
];

module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var researchGroupId = cache.get('/researchGroup/WKPRC');

    await driver.sendMessage({
        type: 'study/create',
        payload: { type: 'wkprc_study', props: {
            // NOTE: requires dev_enableWKPRCPatches in the api config;
            // there is no shorthand then, and csv imports only accept
            // experiments with these names
            name: 'WKPRC Test Study',
            experimentNames: [ 'choice_task', 'other_task', 'multi' ],
            runningPeriod: {
                start: '2024-01-01T00:00:00.000Z',
                end: null,
            },
            researchGroupIds: [ researchGroupId ],
            systemPermissions: {
                isHidden: false,
                accessRightsByResearchGroup: [
                    { researchGroupId, permission: 'write' }
                ]
            },
            custom: {
                experimenterIds: [
                    cache.get('/personnel/Alice'),
                    cache.get('/personnel/Bob'),
                ],
                helperPersonIds: [],
                equipmentLinks: [],
                equipmentLocation: '',
                doi: '',
                description: 'study for testing',
            },
        }},
    }, { apiKey });
    var studyId = cache.addId({ collection: 'study', as: 'WKPRC Test Study' });

    await driver.sendMessage({
        type: 'experimentVariant/create',
        payload: {
            type: 'apestudies-wkprc-default',
            studyId,
            props: { isEnabled: true },
        },
    }, { apiKey });
    var experimentVariantId = cache.addId({
        collection: 'experimentVariant',
        as: 'WKPRC Test Study apestudies-wkprc-default'
    });

    for (var subjectTypeKey of subjectTypes) {
        await driver.sendMessage({
            type: 'experiment-variant-setting/apestudies-wkprc-default/create',
            payload: {
                studyId,
                experimentVariantId,
                props: {
                    subjectTypeKey,
                    locationTypeKeys: [ 'wkprc_ape_location' ],
                },
            },
        }, { apiKey });
    }
}
