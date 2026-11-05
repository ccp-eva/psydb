'use strict';
var { seedFakerForNextId } = require('../../../utils');

module.exports = async (context) => {
    var { driver, cache, as, idgen } = context;

    seedFakerForNextId({ idgen, collection: 'helperSet' });
    await driver.helperSet.create({ displayNames: {
        'en': 'Acquisition (Cat Owners)',
        'de': 'Akquise (Katzenbesitzer:innen)'
    }});
    cache.addId({ collection: 'helperSet', as: 'catOwner_acquisition' });

    await createItems({ driver, cache, idgen, setLabel: 'catOwner_acquisition', items: [
        { en: 'Flyer', de: 'Flyer' },
        { en: 'Website', de: 'Webseite' },
        { en: 'Cat Shelter', de: 'Tierheim' },
        { en: 'Veterinarian', de: 'Tierarztpraxis' },
        { en: 'Word of Mouth', de: 'Mundpropaganda' },
    ]});

    seedFakerForNextId({ idgen, collection: 'helperSet' });
    await driver.helperSet.create({ displayNames: {
        'en': 'Rearing History (Cats)',
        'de': 'Aufzucht (Katzen)'
    }});
    cache.addId({ collection: 'helperSet', as: 'cat_rearingHistory' });

    await createItems({ driver, cache, idgen, setLabel: 'cat_rearingHistory', items: [
        { en: 'Mother-Reared', de: 'Von der Mutter aufgezogen' },
        { en: 'Hand-Reared', de: 'Von Hand aufgezogen' },
        { en: 'Feral', de: 'Verwildert' },
        { en: 'Shelter-Born', de: 'Im Tierheim geboren' },
    ]});
}

var createItems = async (bag) => {
    var { driver, cache, idgen, setLabel, items } = bag;
    var setId = cache.get(`/helperSet/${setLabel}`);

    for (var it of items) {
        var { en, ...i18n } = it;
        seedFakerForNextId({ idgen, collection: 'helperSetItem' });
        await driver.sendMessage({
            type: 'helperSetItem/create',
            payload: { setId, props: {
                label: en,
                displayNameI18N: i18n,
            }},
        });
    }
}
