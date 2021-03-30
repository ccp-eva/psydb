'use strict';

var {
    ExactObject,
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var resolveForeignIdDataFromState =
    require('./resolve-foreign-id-data-from-state');

var createSchemaForRecord =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record');

var fetchRelatedRecordLabels = async ({
    db,
    collectionName,
    collectionCreatorData,
    record
}) => {

    var recordSchema = await createSchemaForRecord({
        db,
        collectionName,
        record,
        fullRecord: true
    });
    
    var foreignIdData = resolveForeignIdDataFromState({
        stateSchema: recordSchema,
        stateData: record,
    });

    console.log(foreignIdData);
}


// FIXME: redundant
var findCustomRecordType = async ({ db, collection, type }) => {
    var customRecordTypes = await (
        db.collection('customRecordType').find(
            { collection, type },
            { 'state.isNew': true, 'state.settings': true }
        ).toArray()
    );

    if (customRecordTypes.length < 1) {
        throw new Error(inline`
            no customRecordType entry found for
            collection "${collection}" with type "${type}"
        `);
    }
    else if (customRecordTypes.length > 1) {
        throw new Error(inline`
            multiple customRecordType entries found for
            collection "${collection}" with type "${type}"
        `);
    }

    //console.log(customRecordTypes);
    var customRecordType = customRecordTypes[0];
    if (customRecordType.isNew) {
        throw new Error(inline`
            custom record type for collection "${collection}"
            with type "${type}" is flagged as "new" and
            has never been commited; please create an 
            initial commit first
        `);
    }
    
    return customRecordType;
}

module.exports = fetchRelatedRecordLabels;
