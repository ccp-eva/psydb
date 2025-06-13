'use strict';

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    await driver.helperSet.create({ displayNames: {
        'en': 'Akquisition (Cat Owners)',
        'de': 'Akquise (Katzenbesitzer:innen)'
    }});
    cache.addId({ collection: 'helperSet', as: 'catOwner_acquisition' });

    await driver.helperSet.create({ displayNames: {
        'en': 'Rearing History (Cats)',
        'de': 'Aufzucht (Katzen)'
    }});
    cache.addId({ collection: 'helperSet', as: 'cat_rearingHistory' });
}
