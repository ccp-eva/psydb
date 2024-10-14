'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createRARole = require('./create-ra-role');
var createScientistRole = require('./create-scientist-role');

var createLocationCRT = require('./create-location-crt');
var createSubjectCRT = require('./create-subject-crt');
var createStudyCRT = require('./create-study-crt');

var subjects = [
    {
        type: 'wkprc_chimpanzee',
        crtLabels: { en: 'Chimpanzees', de: 'Schimpansen' },
        speciesLabels: {
            en: 'WKPRC Chimpanzee Sub-Species',
            de: 'WKPRC Schimpanzen Sub-Species',
        }
    },
    { type: 'wkprc_bonobo', label: 'Bonobo' },
    { type: 'wkprc_gorilla', label: 'Gorilla' },
    { type: 'wkprc_orang_utan', label: 'Orang-Utan' },
];

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { driver, cache };

    await createRARole({ ...context, as: 'ra' });
    await createScientistRole({ ...context, as: 'scientist' });

    //await createLocationTypeSet({ ...context, as: 'locationType' });
    await driver.helperSet.create({ displayNames: {
        'en': 'WKPRC Origin',
        'de': 'WKPRC Herkunft'
    }});
    cache.addId({ collection: 'helperSet', as: 'origin' });

    await driver.helperSet.create({ displayNames: {
        'en': 'WKPRC Rearing History',
        'de': 'WKPRC Aufzucht'
    }});
    cache.addId({ collection: 'helperSet', as: 'rearingHistory' });

    await createLocationCRT({ driver, cache, as: 'location' });

    for (var it of subjects) {
        var { type, label, crtLabels, speciesLabels } = it;
        
        await driver.helperSet.create({
            displayNames: speciesLabels || {
                en: `WKPRC ${label} Sub-Species`,
                de: `WKPRC ${label} Sub-Spezies`,
            }
        });
        cache.addId({ collection: 'helperSet', as: `${type}SubSpecies` });

        await createSubjectCRT({
            driver, cache,
            type, displayNames: speciesLabels || {
                en: `${label}s`,
                de: `${label}s`,
            },
        });
    }

    await createStudyCRT({ driver, cache, as: 'study' });
}
