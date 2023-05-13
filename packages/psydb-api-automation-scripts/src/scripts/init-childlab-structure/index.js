'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var Cache = require('../../cache');

var apiKey = [
    'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
    'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
].join('');


var WrappedCache = ({ driver }) => {
    var cache = Cache();

    cache.addId = ({ collection, as }) => {
        var id = driver.getCache().lastChannelIds[collection];
        cache.merge({ [collection]: { [as]: id }});
        return id;
    }

    return cache;
}

module.exports = async (bag) => {
    var { driver } = bag;
    var cache = WrappedCache({ driver });
    var context = { apiKey, driver, cache };

    await createRARole({ ...context, as: 'ra' });
    await createScientistRole({ ...context, as: 'scientist' });
    await createHiwiRole({ ...context, as: 'hiwi' });
    await createReceptionRole({ ...context, as: 'reception' });

    await createLanguageSet({ ...context, as: 'language' });
    await createNovelSet({ ...context, as: 'novel' });
    await createAcquisitionSet({ ...context, as: 'acquisition' });

    await createKigaUmbrellaOrgCRT({ ...context, as: 'kigaUmbrellaOrg' });

    await createKigaCRT({ ...context, as: 'kiga' });
    await createInstituteRoomCRT({ ...context, as: 'instituteroom' });

    await childCRT({ ...context, as: 'child' });
    await studyCRT({ ...context, as: 'default' });
}
