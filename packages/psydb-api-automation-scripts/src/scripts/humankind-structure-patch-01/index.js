'use strict';
var { MongoClient } = require('mongodb');
var { ejson, entries } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var createHortCRT = require('./create-hort-crt');
var addChildHortId = require('./add-child-hort-id');
var makeAdultAddressOptional = require('./make-adult-address-optional');

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
        mongodbConnectString, { useUnifiedTopology: true }
    );

    var db = mongo.db();
    var cache = WrappedCache({ driver });

    var childCRT = await findOne_RAW({ db, customRecordType: {
        collection: 'subject', type: 'humankindChild'
    }});
    var adultCRT = await findOne_RAW({ db, customRecordType: {
        collection: 'subject', type: 'humankindAdult'
    }});

    var context = { apiKey, driver, cache, db };

    await createHortCRT({ ...context, as: 'hort' });
    await addChildHortId({ ...context, crtId: childCRT._id });
    await makeAdultAddressOptional({ ...context, crtId: adultCRT._id });
    
    mongo.close();
}
