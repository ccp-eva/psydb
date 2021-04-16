'use strict';
var debug = require('debug')('psydb:api:lib:fetch-record-by-id');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var SystemPermissionStages = require('./fetch-record-helpers/system-permission-stages');
var createRecordLabel = require('./create-record-label');

var fetchRecordById = async ({
    db,
    collectionName,
    permissions,
    hasSubChannels,
    recordLabelDefinition,
    id,
    labelOnly,
}) => {
    //var { hasSubChannels } = allSchemaCreators[collectionName];

    var preprocessingStages = (
        hasSubChannels
        ? [
            { $addFields: {
                'gdpr._lastKnownEventId': { $arrayElemAt: [ '$gdpr.events._id', 0 ]},
                'scientific._lastKnownEventId': { $arrayElemAt: [ '$gdpr.scientific._id', 0 ]},
            }},
            { $project: {
                'gdpr.events': false,
                'scientific.events': false,
            }},
        ]
        : [
            { $addFields: {
                '_lastKnownEventId': { $arrayElemAt: [ '$events._id', 0 ]},
            }},
            { $project: {
                events: false,
            }},
        ]
    );

    var resultSet = await (
        db.collection(collectionName).aggregate([
            ...preprocessingStages,
            { $match: {
                _id: id
            }},
            ...SystemPermissionStages({ permissions, hasSubChannels }),
        ]).toArray()
    );

    var record = resultSet[0];

    if (recordLabelDefinition) {
        record._recordLabel = createRecordLabel({
            record: record,
            definition: recordLabelDefinition,
        });
    }

    return (
        labelOnly
        ? record._recordLabel
        : record
    );

}

module.exports = fetchRecordById;
