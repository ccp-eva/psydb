'use strict';

module.exports = async (context) => {
    var { driver, cache, as } = context;
    
    await driver.helperSet.create({ displayNames: {
        'en': 'Uganda Ethnicity',
        'de': 'Uganda Ethnie'
    }});
    cache.addId({ collection: 'helperSet', as: 'fs_uganda_ethnicity' });

    await driver.helperSet.create({ displayNames: {
        'en': 'Uganda Language',
        'de': 'Uganda Sprache'
    }});
    cache.addId({ collection: 'helperSet', as: 'fs_uganda_language' });
}
