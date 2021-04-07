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
    filter,
}) => {
    var resultSet = await (
        db.collection(collectionName).aggregate([
            ...SystemPermissionStages({ permissions, hasSubChannels }),
            { $project: {
                events: false,
                'gdpr.events': false,
                'scientific.events': false,
            }},
        ]).toArray()
    );

    return resultSet[0];
}

module.exports = fetchRecordById;
