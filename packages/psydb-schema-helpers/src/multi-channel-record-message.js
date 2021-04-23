'use strict';
var { isPlainObject } = require('is-what');

var {
    ExactObject,
    Id
} = require('@mpieva/psydb-schema-fields');

var createMessageType = require('./create-record-message-type'),
    Message = require('./message');

var subChannelKeys = [
    'scientific',
    'gdpr'
];

var createPayloadPropsSchema = ({
    subChannelCustomFieldDefinitions,
    subChannelStateSchemaCreators
}) => {
    subChannelCustomFieldDefinitions = subChannelCustomFieldDefinitions || {};
    

    var subChannelSchemas = {};
    for (var key of subChannelKeys) {
        var SchemaCreator = subChannelStateSchemaCreators[key],
            customFieldDefinitions = subChannelCustomFieldDefinitions[key] || [];
        
        subChannelSchemas[key] = SchemaCreator({
            enableInternalProps: false,
            customFieldDefinitions
        });
    }

    return ExactObject({
        properties: {
            ...subChannelSchemas
        },
        required: [
            'scientific'
            // gdpr is optional in the message
            // because that subchannel megth have been removed
        ]
    });
}

var MultiChannelRecordCreateMessage = ({
    collection,
    type,

    staticCreatePropSchemas,

    subChannelCustomFieldDefinitions,
    subChannelStateSchemaCreators
}) => {
    staticCreatePropSchemas = staticCreatePropSchemas || {};
    
    if (staticCreatePropSchemas.id !== undefined) {
        throw new Error(
            'staticCreatePropSchemas may not contain key "id"'
        )
    }
    if (staticCreatePropSchemas.props !== undefined) {
        throw new Error(
            'staticCreatePropSchemas may not contain key "props"'
        )
    }
    var staticCreatePropKeys = Object.keys(staticCreatePropSchemas);

    var payloadPropsSchema = createPayloadPropsSchema({
        subChannelCustomFieldDefinitions,
        subChannelStateSchemaCreators
    });

    return Message({
        type: createMessageType({ collection, type, op: 'create' }),
        payload: ExactObject({
            properties: {
                id: Id(), // user can optionally force create id
                props: payloadPropsSchema,

                ...staticCreatePropSchemas,
            },
            required: [
                ...staticCreatePropKeys,
                'props',
            ]
        })
    });
}

var MultiChannelRecordPatchMessage = ({
    collection,
    type,

    subChannelCustomFieldDefinitions,
    subChannelStateSchemaCreators
}) => {

    var payloadPropsSchema = createPayloadPropsSchema({
        subChannelCustomFieldDefinitions,
        subChannelStateSchemaCreators
    });


    return Message({
        type: createMessageType({ collection, type, op: 'patch' }),
        payload: ExactObject({
            properties: {
                id: Id(),
                props: payloadPropsSchema,
            },
            required: [
                'id',
                'props',
            ]
        })
    });
}

var MultiChannelRecordDeleteGdprMessage = ({
    collection,
    type,
}) => {
    return Message({
        type: createMessageType({ collection, type, op: 'deleteGdpr' }),
        payload: ExactObject({
            properties: {
                id: Id(),
            },
            required: [
                'id',
            ]
        })
    });
}

// FIXME: additional creator props when needed
var MultiChannelRecordMessage = (params) => {
    var {
        collection,
        type,
        op,
        staticCreatePropSchemas,

        subChannelCustomFieldDefinitions,
        subChannelStateSchemaCreators
    } = params;
    
    if (!collection) {
        throw new Error('param "collection" is required');
    }
    if (!op) {
        throw new Error('param "op" is required');
    }
    if (!subChannelStateSchemaCreators) {
        throw new Error('param "subChannelStateSchemaCreators" is required');
    }
    if (
        subChannelCustomFieldDefinitions !== undefined
        && !isPlainObject(subChannelCustomFieldDefinitions)
    ) {
        throw new Error('param "subChannelCustomFieldDefinitions" must be a plain object');
    }
    if (
        staticCreatePropSchemas !== undefined
        && !isPlainObject(staticCreatePropSchemas)
    ) {
        throw new Error('param "customSubChannelPropSchemas" must be a plain object');
    }

    switch (op) {
        case 'create':
            return MultiChannelRecordCreateMessage(params);
        case 'patch':
            return MultiChannelRecordPatchMessage(params);
        case 'deleteGdpr':
            return MultiChannelRecordDeleteGdprMessage(params);
        default:
            throw new Error(`unknown message op "${op}"`);
    }

}

module.exports = MultiChannelRecordMessage;
