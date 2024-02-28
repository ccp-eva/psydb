'use strict';
module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var setId = cache.get('/helperSet/acquisition');

    var labels = [
        {
            en: 'Social Media / Internet',
            de: 'Social Media / Internet'
        },
        {
            en: 'Postal Service',
            de: 'Post'
        },
        {
            en: 'E-Mail',
            de: 'E-Mail'
        },
        {
            en: 'Friends / Acquaintances',
            de: 'Freunde / Bekannte'
        },
        {
            en: 'HumanKind-Event',
            de: 'HumanKind-Event'
        },
        {
            en: 'Playground / Park / Non-School Event',
            de: 'Spielplatz / Park / außerschulische Veranstaltung'
        },
        {
            en: 'Other',
            de: 'Sonstiges'
        },
    ];

    for (var [ix, it] of labels.entries()) {
        await driver.sendMessage({
            type: 'helperSetItem/create',
            payload: { setId, props: {
                label: it.en,
                displayNameI18N: { de: it.de }
            }},
        }, { apiKey });

        cache.addId({
            collection: 'helperSetItem',
            recordType: 'acquisition',
            as: it.en
        });
    }
}



