'use strict';
var debug = require('debug')('psydb:api:lib:fetch-record-by-id');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var SystemPermissionStages = require('./fetch-record-helpers/system-permission-stages');

var fetchRecordById = async ({
    db,
    collectionName,
    permissions,
    hasSubChannels,
    id,
}) => {
    var { hasSubChannels } = allSchemaCreators[collectionName];

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
            { $addFields: {
                '_lastKnownEventId': { $arrayElemAt: [ '$events._id', 0 ]},
            }},
            { $match: {
                _id: id
            }},
            ...SystemPermissionStages({ permissions, hasSubChannels }),
        ]).toArray()
    );

    return resultSet[0];
}

module.exports = fetchRecordById;
