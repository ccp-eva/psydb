'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareLocationRecord = async (context, options) => {
    var { db, cache } = context;
    var { locationId } = options;
    
    var locationRecord = await (
        db.collection('location').findOne({
            _id: locationId,
        })
    )

    if (!locationRecord) {
        throw new ApiError(400, 'InvalidLocationId');
    }

    cache.locationRecord = locationRecord;
}

module.exports = prepareLocationRecord;
