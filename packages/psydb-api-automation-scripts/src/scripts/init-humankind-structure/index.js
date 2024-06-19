'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createSystemRoles = require('./create-system-roles');
var createHelperSets = require('./create-helper-sets');

var createKigaUmbrellaOrgCRT = require('./create-kiga-umbrella-org-crt');
var createKigaCRT = require('./create-kiga-crt');
var createInstituteRoomCRT = require('./create-instituteroom-crt');
var adultCRT = require('./create-adult-crt');
var childCRT = require('./create-child-crt');
var studyCRT = require('./create-study-crt');


module.exports = async (bag) => {
    var { driver, apiKey, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { apiKey, driver, cache };

    await createSystemRoles({ ...context });
    await createHelperSets({ ...context });

    await createKigaUmbrellaOrgCRT({ ...context, as: 'kigaUmbrellaOrg' });
    await createKigaCRT({ ...context, as: 'kiga' });
    await createInstituteRoomCRT({ ...context, as: 'instituteroom' });

    await adultCRT({ ...context, as: 'adult' });
    await childCRT({ ...context, as: 'child' });
    await studyCRT({ ...context, as: 'default' });
}
