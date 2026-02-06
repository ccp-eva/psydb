'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createRARole = require('./create-ra-role');
var createScientistRole = require('./create-scientist-role');
var createHiwiRole = require('./create-hiwi-role');
var createReceptionRole = require('./create-reception-role');

var createHelperSets = require('./create-helper-sets');

var createKigaUmbrellaOrgCRT = require('./create-kiga-umbrella-org-crt');
var createKigaCRT = require('./create-kiga-crt');
var createInstituteRoomCRT = require('./create-instituteroom-crt');
var childCRT = require('./create-child-crt');
var studyCRT = require('./create-study-crt');


module.exports = async (bag) => {
    var { driver, apiKey, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { apiKey, driver, cache };

    await createRARole({ ...context, as: 'ra' });
    await createScientistRole({ ...context, as: 'scientist' });
    await createHiwiRole({ ...context, as: 'hiwi' });
    await createReceptionRole({ ...context, as: 'reception' });

    await createHelperSets({ ...context });

    await createKigaUmbrellaOrgCRT({ ...context, as: 'kigaUmbrellaOrg' });

    await createKigaCRT({ ...context, as: 'kiga' });
    await createInstituteRoomCRT({ ...context, as: 'instituteroom' });

    await childCRT({ ...context, as: 'child' });
    await studyCRT({ ...context, as: 'default' });
}
