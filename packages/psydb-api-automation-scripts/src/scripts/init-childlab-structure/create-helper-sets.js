'use strict';
module.exports = async (context) => {
    var { driver, cache } = context;

    await driver.helperSet.create({ displayNames: {
        'en': 'Language',
        'de': 'Sprache'
    }});
    cache.addId({ collection: 'helperSet', as: 'language' });

    await driver.helperSet.create({ displayNames: {
        'en': 'Acquisition',
        'de': 'Akquise',
    }});
    cache.addId({ collection: 'helperSet', as: 'acquisition' });
    
    await driver.helperSet.create({ displayNames: {
        'en': 'Novel',
        'de': 'Novel',
    }});
    cache.addId({ collection: 'helperSet', as: 'novel' });
}
