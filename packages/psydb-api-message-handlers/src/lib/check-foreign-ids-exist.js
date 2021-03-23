'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var checkForeignIdsExist = async (db, mapping) => {
    for (var collection of Object.keys(mapping)) {
        var arrayOrId = mapping[collection];

        var ids = (
            Array.isArray(arrayOrId)
            ? arrayOrId
            : [ arrayOrId ]
        );
        
        await checkOne({
            db,
            collection,
            wantedIds: ids
        });
    }
}

var checkOne = async ({
    db,
    collection,
    wantedIds
}) => {
    var existing = await (
        db.collection(collection)
        .find(
            { _id: { $in: wantedIds }},
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
