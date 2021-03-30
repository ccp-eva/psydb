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
        fullSchema: true
    });
    
    var foreignIdData = resolveForeignIdDataFromState({
        stateSchema: recordSchema,
        stateData: record,
    });

    console.log(foreignIdData);
}

module.exports = fetchRelatedRecordLabels;
