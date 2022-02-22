'use strict';
var inline = require('@cdxoo/inline-text');

var {
    InvalidCollection,
    RecordTypeRequired,
    RecordTypeNotFound
} = require('@mpieva/psydb-api-lib-errors');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');
var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var fetchCRTSettings = async (options) => {
    var { db, collectionName, recordType } = options;

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData || collectionName === 'customRecordType') {
        throw new InvalidCollection(`collection name "${collectionName}"`);
    }

    var {
        hasCustomTypes,
        hasSubChannels,
        availableStaticDisplayFields,
    } = collectionCreatorData;

    if (hasCustomTypes && !recordType) {
        throw new RecordTypeRequired(
            `collection "${collectionName}" requires type specification`
        );
    }

    var crt = await fetchOneCustomRecordType({
        db,
        collection: collectionName,
        type: recordType
    });
    if (!crt) {
        throw new RecordTypeNotFound(inline`
            could not find custom record type for
            "${collectionName}/${recordType}"
        `);
    }

    var {
        isNew,
        isDirty,
        nextSettings,
        settings,
        ...otherState
    } = crt.state;

    var {
        subChannelFields,
        fields,
        ...otherSettings
    } = settings;

    var fieldDefinitions = (
        hasSubChannels
        ? subChannelFields
        : fields
    );

    if (availableStaticDisplayFields) {
        if (hasSubChannels) {
            fieldDefinitions.gdpr.push(
                ...availableStaticDisplayFields
                .filter(it => (
                    it.dataPointer.startsWith('/gdpr/')
                ))
                // FIXME: compat
                .map(it => ({ ...it, pointer: it.dataPointer }))
            );
            fieldDefinitions.scientific.push(
                ...availableStaticDisplayFields.filter(it => (
                    it.dataPointer.startsWith('/scientifix/')
                ))
                // FIXME: compat
                .map(it => ({ ...it, pointer: it.dataPointer }))
            );
        }
        else {
            fieldDefinitions.push(
                ...availableStaticDisplayFields
                // FIXME: compat
                .map(it => ({ ...it, pointer: it.dataPointer }))
            );
        }
    }

    return {
        hasSubChannels,
        fieldDefinitions,
        ...otherSettings,
        ...otherState,
    }
}

module.exports = fetchCRTSettings;
