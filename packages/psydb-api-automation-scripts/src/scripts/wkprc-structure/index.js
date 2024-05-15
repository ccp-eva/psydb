'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createRARole = require('./create-ra-role');
var createScientistRole = require('./create-scientist-role');

var createLocationCRT = require('./create-location-crt');
var createSubjectCRT = require('./create-subject-crt');
var createStudyCRT = require('./create-study-crt');

var createResearchGroup = require('./create-research-group');

var subjects = [
    {
        type: 'wkprc_chimpanzee',
        crtLabels: { en: 'Chimpanzees', de: 'Schimpansen' },
        speciesLabels: {
            en: 'Chimpanzee Sub-Species',
            de: 'Schimpansen Sub-Species',
        }
    },
    { type: 'wkprc_bonobo', label: 'Bonobo' },
    { type: 'wkprc_gorilla', label: 'Gorilla' },
    // XXX: wkprc_orang_utan
    { type: 'wkprc_orangutan', label: 'Orang-Utan' },
];

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { driver, cache };

    await createRARole({ ...context, as: 'wkprc_ra' });
    await createScientistRole({ ...context, as: 'wkprc_scientist' });

    //await createLocationTypeSet({ ...context, as: 'locationType' });
    await driver.helperSet.create({ displayNames: {
        'en': 'Origin',
        'de': 'Herkunft'
    }});
    cache.addId({ collection: 'helperSet', as: 'wkprc_origin' });

    await driver.helperSet.create({ displayNames: {
        'en': 'Rearing History',
        'de': 'Aufzucht'
    }});
    cache.addId({ collection: 'helperSet', as: 'wkprc_rearingHistory' });

    await createLocationCRT({ driver, cache, as: 'wkprc_apeLocation' });

    for (var it of subjects) {
        var { type, label, crtLabels, speciesLabels } = it;
        
        await driver.helperSet.create({
            displayNames: speciesLabels || {
                en: `${label} Sub-Species`,
                de: `${label} Sub-Spezies`,
            }
        });
        cache.addId({
            collection: 'helperSet', as: `${type}SubSpecies`
        });

        await createSubjectCRT({
            driver, cache,
            type, displayNames: crtLabels || {
                en: `${label}s`,
                de: `${label}s`,
            },
        });
    }

    await createStudyCRT({ driver, cache, as: 'wkprc_study' });

    await createResearchGroup(context);
}
