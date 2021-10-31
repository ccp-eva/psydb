'use strict';
var ApiError = require('./api-error'),
    compareIds = require('./compare-ids');

var checkForeignIdsExist = async (db, mapping) => {
    for (var collection of Object.keys(mapping)) {
        var data = mapping[collection];

        var ids = undefined,
            filters = {};
        if (data.ids) {
            ids = data.ids;
            filters = data.filters || {};
        }
        else {
            ids = (
                Array.isArray(data)
                ? data
                : [ data ]
            );
        }
        
        await checkOne({
            db,
            collection,
            wantedIds: ids,
            filters,
        });
    }
}

var checkOne = async ({
    db,
    collection,
    wantedIds,
    filters
}) => {
    filters = filters || {};

    var existing = await (
        db.collection(collection)
        .find(
            { _id: { $in: wantedIds }, ...filters},
            { _id: true }
        )
        .toArray()
    );

    var existingIds = existing.map(it => it._id),
        missingIds = [];
    
    for (var wantedId of wantedIds) {
        var exists = false;
        for (var existingId of existingIds) {
            if (compareIds(wantedId, existingId)) {
                exists = true;
                break;
            }
        }
        if (exists === false) {
            missingIds.push(wantedId);
        }
    }

    if (missingIds.length > 0) {
        // TODO: missingIds needs to be passed to ResponseBody
        // TODO: also the collection must be stated
        // TODO: we need to pass the index instead (?)
        // EDIT: with rsjf this is actually required i think maybe
        throw new ApiError(400, 'InvalidForeignId')
    }
}

module.exports = checkForeignIdsExist;
