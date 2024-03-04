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
    { type: 'chimpanzee', label: 'Chimpanzee' },
    { type: 'bonobo', label: 'Bonobo' },
    { type: 'gorilla', label: 'Gorilla' },
    { type: 'orang_utan', label: 'Orang-Utan' },
];

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { apiKey, driver, cache };

    await createRARole({ ...context, as: 'ra' });
    await createScientistRole({ ...context, as: 'scientist' });

    //await createLocationTypeSet({ ...context, as: 'locationType' });
    await createOriginSet({ ...context, as: 'origin' });
    await createRearingHistorySet({ ...context, as: 'rearingHistory' });

    await createLocationCRT({ ...context, ...it, as: 'location' });

    for (var it of subjects) {
        var { type, label } = it;
        await createSubSpeciesSet({ ...context, type, label });
        await createSubjectCRT({ ...context, type, label: label + 's' });
    }

    await createStudyCRT({ ...context, as: 'study' });
}
