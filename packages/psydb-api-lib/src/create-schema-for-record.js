'use strict';
var inline = require('@cdxoo/inline-text');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var createSchemaForRecord = async ({
    db,
    collectionName,
    record,
    subChannelKey,
    fullSchema,
    prefetchedCustomRecordTypes
}) => {

    var collectionCreatorData = allSchemaCreators[collectionName];
    if (!collectionCreatorData) {
        throw new Error(
            `no creator data found for collection "${collectionName}"`
        );
    }
    
    var {
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

    if (!fullSchema) {
        if (subChannelKey) {
            if (!hasSubChannels) {
                throw new Error(inline`
                    collection "${collection}" does not support subchannels
                `);
            }
            if (!subChannelStateSchemaCreators[subChannelKey]) {
                throw new Error(inline`
                    collection "${collection}" has no schema creator for
                    sub-channel key "${subChannelKey}"
                `);
            }
        }
        else {
            if (hasSubChannels) {
                throw new Error(inline`
                    collection "${collection}" has sub channels but no key
                    was providede
                `);
            }
        }
    }

    var args = {
        enableInternalProps: true,
    };

    if (hasCustomTypes) {
        var customRecordType = undefined;
        if (prefetchedCustomRecordTypes) {
            var filtered = prefetchedCustomRecordTypes.filter(it => ({
                collection: collectionName,
                type: record.type
            }));
            if (filtered.length < 1) {
                throw new Error(inline`
                    could not find ${collectionName}/${recordType}
                    in prefteched custom record type list
                `);
            }
            customRecordType = filtered[0];
        }
        else {
            customRecordType = await findCustomRecordType({
                db,
                collection: collectionName,
                type: record.type
            });
        }
    
        if (hasSubChannels) {
            args.subChannelCustomRecordFieldDefinitions = (
                customRecordType.state.settings.subChannelFields
            );
        }
        else {
            args.customFieldDefinitions = (
                customRecordType.state.settings.fields
            );
        }
    }

    // this collection needs extra argument
    if (collectionName === 'customRecordType') {
        args.collection = record.collection;
    }

    var SchemaCreator = (
        fullSchema === true
        ? FullRecordSchemaCreator({
            collectionCreatorData,
            recordType: record.type,
        })
        : StateSchemaCreator({
            collectionCreatorData,
            recordType: record.type,
            subChannelKey
        })
    );

    var schema = SchemaCreator({ ...args });

    return schema;
}

var StateSchemaCreator = ({
    collectionCreatorData,
    recordType,
    subChannelKey
}) => {
    var {
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

    var SchemaCreator = undefined;
    if (hasSubChannels) {
        SchemaCreator = (
            subChannelStateSchemaCreators[subChannelKey]
        );
    }
    else if (hasFixedTypes) {
        SchemaCreator = (
            collectionCreatorData
            .fixedTypeStateSchemaCreators[recordType]
        );
    }
    else {
        SchemaCreator = collectionCreatorData.State;
    }

    return SchemaCreator;
};

var FullRecordSchemaCreator = ({
    collectionCreatorData,
    recordType
}) => {

    var {
        hasCustomTypes,
        hasFixedTypes,
        hasSubChannels,
        subChannelStateSchemaCreators,
    } = collectionCreatorData;

    var SchemaCreator = undefined;
    if (hasSubChannels) {
        SchemaCreator = () => ExactObject({
            properties: {
                scientific: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.scientific()
                    }
                }),
                gdpr: ExactObject({
                    properties: {
                        state: subChannelStateSchemaCreators.gdpr()
                    }
                }),
            }
        });
    }
    else if (hasFixedTypes) {
        SchemaCreator = () => ExactObject({
            properties: {
                state: (
                    collectionCreatorData
                    .fixedTypeStateSchemaCreators[recordType]()
                )
            }
        });
    }
    else {
        SchemaCreator = () => ExactObject({
            properties: {
                state: collectionCreatorData.State(),
            }
        });
    }

    return SchemaCreator;

}

// FIXME: redundant
var findCustomRecordType = async ({ db, collection, type }) => {
    var customRecordTypes = await (
        db.collection('customRecordType').find(
            { collection, type },
            { 'state.isNew': true, 'state.settings': true }
        ).toArray()
    );

    if (customRecordTypes.length < 1) {
        throw new Error(inline`
            no customRecordType entry found for
            collection "${collection}" with type "${type}"
        `);
    }
    else if (customRecordTypes.length > 1) {
        throw new Error(inline`
            multiple customRecordType entries found for
            collection "${collection}" with type "${type}"
        `);
    }

    //console.log(customRecordTypes);
    var customRecordType = customRecordTypes[0];
    if (customRecordType.isNew) {
        throw new Error(inline`
            custom record type for collection "${collection}"
            with type "${type}" is flagged as "new" and
            has never been commited; please create an 
            initial commit first
        `);
    }
    
    return customRecordType;
}

module.exports = createSchemaForRecord;
