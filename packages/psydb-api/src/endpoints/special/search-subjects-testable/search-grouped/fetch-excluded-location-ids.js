'use strict';

var fetchExcludedLocationIds = async (bag) => {
    var { db, locationType } = bag;
    
    var ids = await (
        db.collection('location').find(
            {
                type: locationType,
                $or: [
                    { isDummy: true },
                    { 'state.systemPermissions.isHidden': true },
                    { 'state.internals.isRemoved': true }
                ],
            },
            { projection: { _id: true }}
        ).map(it => it._id).toArray()
    );

    return ids;
}

module.exports = fetchExcludedLocationIds;
