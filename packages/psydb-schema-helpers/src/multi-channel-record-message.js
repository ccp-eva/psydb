'use strict';
var { isPlainObject } = require('is-what');

var subChannelKeys = [
    'scientific',
    'gdpr'
];

var createPayloadPropsSchema = ({
    subChannelCustomPropSchemas,
    subChannelStateSchemaCreators
}) => {
    var subChannelSchemas = {};
    for (var key of subChannelKeys) {
        var SchemaCreator = subCannelStateSchemaCreators[key],
            customPropSchemas = subChannelCustomPropSchemas[key];
        
        subChannelSchemas[key] = SchemaCreator({
            enableInternalProps: false,
            customPropSchemas
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

    subChannelCustomPropSchemas,
    subChannelStateSchemaCreators
}) => {
    
    if (staticCreatePropKeys.id !== undefined) {
        throw new Error(
            'staticCreatePropSchemas may not contain key "id"'
        )
    }
    if (staticCreatePropKeys.props !== undefined) {
        throw new Error(
            'staticCreatePropSchemas may not contain key "props"'
        )
    }
    var staticCreatePropKeys = Object.keys(staticCreatePropSchemas);

    var paylodPropsSchema = createPayloadPropsSchema({
        subChannelCustomPropSchemas,
        subChannelStateSchemaCreators
    });

    return Message({
        type: createMessageType({ collection, type, op: 'create' }),
        payload: ExactObject({
            properties: {
                id: Id(), // user can optionally force create id
                props: payloadPropsSchema,

                ...staticCreatePropSchemas,

                required: [
                    ...staticCreatePropKeys
                    'props',
                ]
            },
        })
    });
}

var MultiChannelRecordPatchmessage = ({
    collection,
    type,

    subChannelCustomPropSchemas,
    subChannelStateSchemaCreators
}) => {

    var subChannelSchemas = createSubChannelSchemas({
        subChannelCustomPropSchemas,
        subChannelStateSchemaCreators
    });

    return Message({
        type: createMessageType({ collection, type, op: 'patch' }),
        payload: ExactObject({
            properties: {
                id: Id(),
                props: ExactObject({
                    properties: { ...subChannelSchemas },
                    required: [
                        'scientific'
                        // gdpr is optional in the message
                        // because that subchannel megth have been removed
                    ]
                }),
                required: [
                    'id',
                    'props',
                ]
            },
        })
    });
}


var MultiChannelRecordMessage = (options) => {
    var {
        collection,
        type,
        op,
        staticCreatePropSchemas,

        customSubChannelPropSchemas,
        subChannelStateSchemaCreators
    } = params;
    
    if (!collection) {
        throw new Error('param "collection" is required');
    }
    if (!op) {
        throw new Error('param "op" is required');
    }
    if (!createSubChannelStateSchemaCallback) {
        throw new Error('param "createSubChannelStateSchemaCallbacks" is required');
    }
    if (
        customSubChannelPropSchemas !== undefined
        && !isPlainObject(customSubChannelPropSchemas)
    ) {
        throw new Error('param "customSubChannelPropSchema" must be a plain object');
    }

    switch (op) {
        case 'create':
            return MultiChannelRecordCreateMessage(options);
        case 'patch':
            return MultiChannelRecordPatchMessage(options);
        case 'deleteGdpr':
            return MiltiChannelRecordDeleteGdprMessage(options);
        default:
            throw new Error(`unknown message op "${op}"`);
    }

}
