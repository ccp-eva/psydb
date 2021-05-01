'use strict';

var jsonpointer = require('jsonpointer');
var inline = require('@cdxoo/inline-text');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var createRecordLabel = require('./create-record-label');

var fetchRelatedRecords = async ({
    db,
    foreignIdRelationData,
    labelOnly,
}) => {
    var collectionGroups = groupBy({
        items: foreignIdRelationData,
        byProp: 'collection'
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
                    'state.recordLabelDefinition': true,
                }}
            ]).toArray()
        );
        
        var labelDefinitionData = gatherLabelDefinitionData({
            collections: Object.keys(collectionGroups),
            customRecordTypes
        });

        var { typed, untyped } = groupBy({
            items: labelDefinitionData,
            createKey: (it) => (it.type ? 'typed' : 'untyped')
        });

        var keyedLabelDefinitionData = {
            ...keyBy({
                items: typed || [],
                createKey: (it) => (`${it.collection}~~${it.type}`)
            }),
            ...keyBy({
                items: untyped || [],
                byProp: 'collection'
            })
        };
    }

    var result = {};
    for (var collectionName of Object.keys(collectionGroups)) {
        var records = await db.collection(collectionName).aggregate([
            { $project: {
                events: false
            }},
            { $match: {
                _id: { $in: (
                    collectionGroups[collectionName].map(it => it.value)
                )}
            }},
            /*{ $addFields: {
                'foo': { $cond: {
                    if: { $eq: ['teacher', '$type'] },
                    then: { 
                        '/gdpr/state/custom/firstname': '$gdpr.state.custom.firstname',
                        '/gdpr/state/custom/lastname': '$gdpr.state.custom.lastname',
                    },
                    else: '$$REMOVE'
                }}
            }},*/
        ]).toArray();

        //console.log('AAAAAAAAAAAAAAAAAAAAA');
        //console.log(records);

        if (labelOnly) {
            var {
                hasCustomTypes,
                hasFixedTypes,
                hasSubChannels
            } = allSchemaCreators[collectionName];

            records = records.map(record => {
                var key = undefined;
                if (hasCustomTypes) {
                    key = `${collectionName}~~${record.type}`;
                }
                // TODO: fixed types?
                else {
                    key = collectionName;
                }
                
                var recordLabel = createRecordLabel({
                    definition: keyedLabelDefinitionData[key].definition,
                    record
                });

                return {
                    _id: record._id,
                    _recordLabel: recordLabel,
                };
            });
        }

        result[collectionName] = keyBy({
            items: records,
            byProp: '_id'
        });
    }

    //console.log(result);

    return result;
}

var gatherLabelDefinitionData = ({
    collections,
    customRecordTypes,
    labelType
}) => {

    var groupedCustomRecordTypes = groupBy({
        items: customRecordTypes,
        byProp: 'collection',
    });

    var gathered = [];
    for (var collectionName of collections) {
        var {
            hasCustomTypes,
            hasFixedTypes,
            hasSubChannels
        } = allSchemaCreators[collectionName];
        
        if (hasCustomTypes) {
            var group = groupedCustomRecordTypes[collectionName];
            if (!group) {
                throw new Error(inline`
                    custom record types missing for "${collectionName}"
                `);
            }

            for (var customRecordType of group) {
                var {
                    type
                } = customRecordType;

                var {
                    recordLabelDefinition,
                    optionLabelDefinition // TODO
                } = customRecordType.state;

                if (labelType === 'option') {
                    // TODO
                    throw new Error('not implemented');
                }
                else {
                    gathered.push({
                        collection: collectionName,
                        type,
                        definition: recordLabelDefinition
                    });
                }
            }
        }
        // TODO: fixed types
        else {
            var definition = undefined;
            if (labelType ===  'option') {
                // TODO
                throw new Error('not implemented');
            }
            else {
                definition = (
                    allSchemaCreators[collectionName].recordLabelDefinition
                );
            }
            gathered.push({
                collection: collectionName,
                definition,
            })
        }
    }

    return gathered;
}

module.exports = fetchRelatedRecords; 
