'use strict';

var createSchemaForRecordType =require('./create-schema-for-record-type');
var fetchRelatedLabels = require('./fetch-related-labels');

// TODO: move to lib
var fetchRelatedLabelsForMany = async ({
    db,
    collectionName,
    recordType,
    records,
}) => {

    var recordSchema = await createSchemaForRecordType({
        db,
        collectionName,
        recordType,
        fullSchema: true
    });

    // FIXME: this is really hacky
    var resolveSchema = {
        type: 'object',
        properties: {
            records: {
                type: 'array',
                items: recordSchema,
            }
        }
    }

    var {
        relatedRecords: relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypes: relatedCustomRecordTypeLabels,
    } = await fetchRelatedLabels({
        db,
        data: { records },
        schema: resolveSchema,
    });

    return ({
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    });
}

module.exports = fetchRelatedLabelsForMany;
