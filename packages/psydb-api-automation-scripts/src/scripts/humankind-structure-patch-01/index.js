'use strict';
var { MongoClient } = require('mongodb');
var { ejson, entries } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var makeAdultPhoneAndEmailOptional = require('./make-adult-phone-and-email-optional');
var makeKigaUmbrellaOrgOptional = require('./make-kiga-umbrella-org-optional');

var findOne_RAW = ({ db, ...rest }) => {
    var [ collection, filter ] = entries(rest)[0];
    return db.collection(collection).findOne(filter);
}

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions } = bag;
    var { mongodb: mongodbConnectString } = extraOptions;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }

    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );

    var db = mongo.db();
    var cache = WrappedCache({ driver });
    var context = { driver, cache, db };

    var adultCRT = await findOne_RAW({ db, customRecordType: {
        collection: 'subject', type: 'humankindAdult'
    }});
    var kigaCRT = await findOne_RAW({ db, customRecordType: {
        collection: 'location', type: 'kiga'
    }});

    await makeAdultPhoneAndEmailOptional({
        ...context, crtId: adultCRT._id
    });
    await makeKigaUmbrellaOrgOptional({
        ...context, crtId: kigaCRT._id
    });
    
    mongo.close();
}
