'use strict';

//var fetchAvailableOptions // TODO
var jsonpointer = require('jsonpointer');

var keyBy = require('@mpieva/psydb-api-lib/src/key-by');
var groupBy = require('@mpieva/psydb-api-lib/src/group-by');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var fetchRelatedRecords = async ({
    db,
    foreignIdData,
    labelOnly,
}) => {
    var collectionGroups = groupBy({
        items: foreignIdData,
        byPointer: '/collection'
    });

    var customRecordTypes = undefined;
    if (labelOnly) {
        customRecordTypes = await (
            db.collection('customRecordType').aggregate([
                { $match: {
                    collection: { $in: Object.keys(collectionGroups) },
                    'state.isNew': false,
                }},
                { $project: {
                    collection: true,
                    type: true,
                    'state.label': true,
                    'state.settings': true,
                }}
            ]).toArray()
        );
        var keyedCustomRecordTypes = keyBy({
            items: customRecordTypes,
            createKey: (item) => (`${item.collection}~~${item.type}`),
        });
    }

    var result = {};
    for (var collectionName of Object.keys(collectionGroups)) {
        var records = await db.collection(collectionName).aggregate([
            { $project: {
                events: false
            }},
            { $match: {
                _id: { $in: (
                    collectionGroups[collectionName].map(it => it.id)
                )}
            }},
        ]).toArray();

        if (labelOnly) {
            var {
                hasCustomTypes,
                hasFixedTypes,
                hasSubChannels
            } = allSchemaCreators[collectionName];

            records = records.map(record => {
                if (hasCustomTypes) {
                    var key = `${collectionName}~~${record.type}`;
                    var {
                        label: typeLabel,
                        settings,
                    } = keyedCustomRecordTypes[key].state;
                    var {
                        recordLabelDefinition,
                        // optionLabelDefinition, // TODO
                    } = settings;

                    // TODO: we need to get the fields itself to
                    // ensure proper formatting i guess
                    // alternatively we could decide based
                    // on the acual data type (i.e. Date)
                    //console.log(recordLabelDefinition);

                    var recordLabel = createRecordLabel({
                        definition: recordLabelDefinition,
                        record
                    });

                    return {
                        _id: record._id,
                        typeLabel,
                        recordLabel,
                    };
                }
                else {
                    // TODO: fixed types?
                    return record;
                }
            });
        }

        result[collectionName] = keyBy({
            items: records,
            byPointer: '/_id'
        });
    }

    console.log(result);

    return result;
}

var createRecordLabel = ({ definition, record }) => {
    var {
        format,
        tokens
    } = definition;

    var label = format,
        tokensRedacted = 0;
    for (var [index, pointer] of tokens.reverse().entries()) {
        // reversing index
        index = tokens.length - index - 1;
        var value = jsonpointer.get(record, pointer);
        if (value === undefined) {
            value = 'REDACTED';
            tokensRedacted += 1;
        }
        label = label.replace(
            '${' + index + '}',
            value
        );
    }

    if (tokensRedacted == tokens.length) {
        label = `${record._id}`;
    }
    
    return label;
}

module.exports = fetchRelatedRecords; 
