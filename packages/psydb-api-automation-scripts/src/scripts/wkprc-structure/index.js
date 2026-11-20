'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createRARole = require('./create-ra-role');
var createScientistRole = require('./create-scientist-role');

var createLocationCRT = require('./create-location-crt');
var createSubjectCRT = require('./create-subject-crt');
var createStudyCRT = require('./create-study-crt');

var createResearchGroup = require('./create-research-group');

// NOTE: labels as on the live system (see crt export 2026-11-19)
var subjects = [
    {
        type: 'wkprc_chimpanzee',
        label: 'Chimpanzee',
        speciesSetLabel: 'WKPRC Chimpanzee Sub-Species',
    },
    {
        type: 'wkprc_bonobo',
        label: 'Bonobo',
        speciesSetLabel: 'WKPRC Bonobo',
    },
    {
        type: 'wkprc_gorilla',
        label: 'Gorilla',
        speciesSetLabel: 'WKPRC Gorilla Sub-Species',
    },
    {
        type: 'wkprc_orang_utan',
        label: 'Orang-Utan',
        speciesSetLabel: 'WKPRC Orang-Utan Sub-Species',
    },
];

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { driver, cache };

    await createRARole({ ...context, as: 'wkprc_ra' });
    await createScientistRole({ ...context, as: 'wkprc_scientist' });

    await driver.helperSet.create({ displayNames: { en: 'WKPRC Origin' }});
    cache.addId({ collection: 'helperSet', as: 'wkprc_origin' });

    await driver.helperSet.create({ displayNames: {
        en: 'WKPRC Rearing History'
    }});
    cache.addId({ collection: 'helperSet', as: 'wkprc_rearingHistory' });

    await createLocationCRT({ driver, cache, as: 'wkprc_ape_location' });

    for (var it of subjects) {
        var { type, label, speciesSetLabel } = it;

        await driver.helperSet.create({
            displayNames: { en: speciesSetLabel }
        });
        cache.addId({
            collection: 'helperSet', as: `${type}SubSpecies`
        });

        await createSubjectCRT({
            driver, cache,
            type, displayNames: { en: label },
        });
    }

    await createStudyCRT({ driver, cache, as: 'wkprc_study' });

    await createResearchGroup(context);
}
