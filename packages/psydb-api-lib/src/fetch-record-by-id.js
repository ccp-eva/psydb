'use strict';
var debug = require('debug')('psydb:api:lib:fetch-record-by-id');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var convertPointerToPath = require('./convert-pointer-to-path');
var SystemPermissionStages = require('./fetch-record-helpers/system-permission-stages');
var createRecordLabel = require('./create-record-label');

var OmitRemovedCustomFieldsStage = ({
    removedCustomFields
}) => {
    if (!(
        Array.isArray(removedCustomFields)
        && removedCustomFields.length
    )) {
        return [];
    }

    var stages = [
        { $project: removedCustomFields.reduce((acc, it) => {
            var path = convertPointerToPath(it.pointer);
            return {
                ...acc,
                [path]: false
            }
        }, {})}
    ];

    return stages;
}

var fetchRecordById = async ({
    db,
    collectionName,
    permissions,
    hasSubChannels,
    removedCustomFields,
    recordLabelDefinition,
    id,
    labelOnly,
}) => {
    var { hasSubChannels } = allSchemaCreators[collectionName];

    var preprocessingStages = (
        hasSubChannels
        ? [
            { $addFields: {
                'gdpr._lastKnownEventId': { $arrayElemAt: [ '$gdpr.events._id', 0 ]},
                'scientific._lastKnownEventId': { $arrayElemAt: [ '$scientific.events._id', 0 ]},
            }},
            { $project: {
                // FIXME: any way to not hardcode that?
                'gdpr.internals.passwordHash': false,

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
            ...OmitRemovedCustomFieldsStage({ removedCustomFields }),
            { $match: {
                _id: id,
                ...(
                    hasSubChannels
                    ? { 'scientific.state.internals.isRemoved': { $ne: true }}
                    : { 'state.internals.isRemoved': { $ne: true }}
                ),
            }},
            ...SystemPermissionStages({
                collection: collectionName,
                permissions
            }),
        ]).toArray()
    );

    var record = resultSet[0];
    if (!record) {
        return undefined;
    }

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
