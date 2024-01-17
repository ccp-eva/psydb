'use strict';
var debug = require('debug')('psydb:api:lib:fetch-record-by-id');

var inlineString = require('@cdxoo/inline-string');
var { translationExists } = require('@mpieva/psydb-i18n');
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
    language,
    locale
}) => {
    var { hasSubChannels } = allSchemaCreators[collectionName];

    var preprocessingStages = (
        hasSubChannels
        ? [
            { $addFields: {
                'gdpr._lastKnownEventId': '$gdpr._rohrpostMetadata.lastKnownEventId',
                'scientific._lastKnownEventId': '$scientific._rohrpostMetadata.lastKnownEventId',
            }},
            { $project: {
                _rohrpostMetadata: false,
                // FIXME: any way to not hardcode that?
                'gdpr.internals.passwordHash': false,

                'gdpr._rohrpostMetadata': false,
                'scientific._rohrpostMetadata': false,
            }},
        ]
        : [
            { $addFields: {
                '_lastKnownEventId': '$_rohrpostMetadata.lastKnownEventId',
            }},
            { $project: {
                _rohrpostMetadata: false,
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
            // XXX: locations arent allowed for hiwi
            // but need to be read in subjects
            // => read-for-fk-endpoint
            //
            /*...SystemPermissionStages({
                collection: collectionName,
                permissions
            }),*/
        ]).toArray()
    );

    var record = resultSet[0];
    if (!record) {
        return undefined;
    }

    if (['helperSet', 'helperSetItem'].includes(collectionName)) {
        record._recordLabel = (
            translationExists({ language })
            ? record.state.displayNameI18N[language]
            : record.state.label
        );
    }
    else {
        if (recordLabelDefinition) {
            record._recordLabel = createRecordLabel({
                record: record,
                definition: recordLabelDefinition,
                language,
                locale
            });
        }
    }

    return (
        labelOnly
        ? record._recordLabel
        : record
    );

}

module.exports = fetchRecordById;
