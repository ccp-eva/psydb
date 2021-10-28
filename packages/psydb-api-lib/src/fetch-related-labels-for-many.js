'use strict';

var createSchemaForRecordType =require('./create-schema-for-record-type');
var fetchRelatedLabels = require('./fetch-related-labels');

var fetchRelatedLabelsForMany = async ({
    db,
    collectionName,
    recordType,
    records,
}) => {
    var resolveSchema = undefined;

    if (collectionName === 'customRecordType') {
        var targetCollections = [];
        for (var it of records) {
            if (!targetCollections.includes(it.collection)) {
                targetCollections.push(it.collection);
            }
        }

        var possibleRecordSchemas = [];
        for (var it of targetCollections) {
            var recordSchema = await createSchemaForRecordType({
                db,
                collectionName,
                recordType,
                fullSchema: true,
                additionalSchemaCreatorArgs: {
                    collection: it
                }
            });
            // adding collection prop as full schema dos not recorgnize
            // customRecordTypeCollection specifics
            recordSchema.properties.collection = {
                type: 'string',
                const: it
            };
            possibleRecordSchemas.push(recordSchema);
        }

        // FIXME: this is really hacky
        resolveSchema = {
            type: 'object',
            properties: {
                records: {
                    type: 'array',
                    items: {
                        type: 'object',
                        lazyResolveProp: 'collection',
                        oneOf: possibleRecordSchemas
                    }
                }
            }
        }
    }
    else {
        var recordSchema = await createSchemaForRecordType({
            db,
            collectionName,
            recordType,
            fullSchema: true
        });

        // FIXME: this is really hacky
        resolveSchema = {
            type: 'object',
            properties: {
                records: {
                    type: 'array',
                    items: recordSchema,
                }
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
