'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createRARole = require('./create-ra-role');
var createScientistRole = require('./create-scientist-role');

//var createLocationTypeSet = require('./create-location-type-set');
var createOriginSet = require('./create-origin-set');
var createRearingHistorySet = require('./create-rearing-history-set');
var createSubSpeciesSet = require('./create-sub-species-set');

var createLocationCRT = require('./create-location-crt');
var createSubjectCRT = require('./create-subject-crt');
var createStudyCRT = require('./create-study-crt');

var subjects = [
    { type: 'wkprc_chimpanzee', label: 'Chimpanzee' },
    { type: 'wkprc_bonobo', label: 'Bonobo' },
    { type: 'wkprc_gorilla', label: 'Gorilla' },
    { type: 'wkprc_orangutan', label: 'Orang-Utan' },
];

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { driver, cache };

    await createRARole({ ...context, as: 'ra' });
    await createScientistRole({ ...context, as: 'scientist' });

    //await createLocationTypeSet({ ...context, as: 'locationType' });
    await driver.helperSet.create({
        displayNames: { 'en': 'WKPRC Origin' },
    });
    cache.addId({ collection: 'helperSet', as: 'origin' });

    await driver.helperSet.create({
        displayNames: { 'en': 'WKPRC Rearing History' },
    });
    cache.addId({ collection: 'helperSet', as: 'rearingHistory' });

    await createLocationCRT({ ...context, ...it, as: 'location' });

    for (var it of subjects) {
        var { type, label } = it;
        
        await driver.helperSet.create({
            displayNames: { 'en': `WKPRC ${label} Sub-Species` },
        });
        cache.addId({ collection: 'helperSet', as: `${type}SubSpecies` });

        await createSubjectCRT({ ...context, type, label: label + 's' });
    }

    await createStudyCRT({ ...context, as: 'study' });
}
