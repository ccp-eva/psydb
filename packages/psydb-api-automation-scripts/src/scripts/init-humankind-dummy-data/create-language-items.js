'use strict';
module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var setId = cache.get('/helperSet/language');

    var labels = [
        { en: 'German', de: 'Deutsch' },
        { en: 'English', de: 'Englisch' },
        { en: 'Arabic', de: 'Arabisch' },
        { en: 'Spanish', de: 'Spanisch' },
        { en: 'Russian', de: 'Russisch' },
        { en: 'Turkish', de: 'Türkisch' },

        { en: 'French', de: 'Französisch' },
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
            recordType: 'language',
            as: it.en
        });
    }
}



