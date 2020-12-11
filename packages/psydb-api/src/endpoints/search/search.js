'use strict';
var searchUnrestricted = require('./search-unrestricted'),
    searchWithRecordRestrictions = require('./search-with-record-restrictions'),
    searchWithFullRestrictions = require('./search-with-full-restrictions');

var search = async (context) => {
    var { permissions, schemas, db } = context;
    var { collectionName } = context.params;
    var searchParams = context.request.body;

    // => undefined, unrestricted, record-restricted, field-restricted
    var access = permissions.collectionReadAccess({
        collectionName
    });

    if (!access) {
        throw new Error('permission denied');
    }

    var collection = db.collection(collectionName),
        records = undefined;
    if (access === 'unrestricted') {
        records = await searchUnrestricted({
            collection,
            ...searchParams
        });
    }
    else if (access === 'record-restricted') {
        records = await searchWithRecordRestrictions({
            collection,
            allowedResearchGroupIds: permissions.allowedResearchGroupIds(),
            ...searchParams,
        });
    }
    else if (access === 'fully-restricted') {
        records = await searchWithFullRestrictions({
            collection,
            allowedResearchGroupIds: permissions.allowedResearchGroupIds(),
            searchableFields: permissions.searchableFields(),
            readableFields: permissions.readableFields(),
            ...searchParams,
        });
    }

    context.body = {
        metadata: {
            schema: schemas[collectionName],
        },
        data: records,
    }

    await next();
}

var getCollectionHandle = ({
    db,
    collectionName,
    permissions
}) => {

}
