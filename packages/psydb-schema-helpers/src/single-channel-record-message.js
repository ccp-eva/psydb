'use strict';
var {
    isArray,
    isPlainObject
} = require('is-what');

var {
    ExactObject,
    Id
} = require('@mpieva/psydb-schema-fields');

var createMessageType = require('./create-record-message-type'),
    Message = require('./message');

var SingleChannelRecordCreateMessage = ({
    collection,
    type,
    staticCreatePropSchemas,
    customFieldDefinitions,
    stateSchemaCreator,
    propsSchema,
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

    return Message({
        type: createMessageType({ collection, type, op: 'create' }),
        payload: ExactObject({
            properties: {
                id: Id(), // user can optionally force create id
                props: propsSchema || stateSchemaCreator({
                    enableInternalProps: false,
                    customFieldDefinitions,
                }),
                
                ...staticCreatePropSchemas,
            },
            required: [
                ...staticCreatePropKeys,
                'props',
            ]
        })
    });
}

var SingleChannelRecordPatchMessage = ({
    collection,
    type,
    customFieldDefinitions,
    stateSchemaCreator,
    propsSchema,
}) => {
    return Message({
        type: createMessageType({ collection, type, op: 'patch' }),
        payload: ExactObject({
            properties: {
                id: Id(),
                props: propsSchema || stateSchemaCreator({
                    enableInternalProps: false,
                    customFieldDefinitions
                }),
            },
            required: [
                'id',
                'props',
            ]
        })
    });
}

var SingleChannelRecordMessage = (params) => {
    var {
        collection,
        type,
        op,
        staticCreatePropSchemas,

        customFieldDefinitions,
        stateSchemaCreator,

        propsSchema,
    } = params;

    if (!op) {
        throw new Error('param "op" is required');
    }
    if (!propsSchema) {
        if (!collection) {
            throw new Error('param "collection" is required');
        }
        if (!stateSchemaCreator) {
            throw new Error('param "stateSchemaCreator" is required');
        }
        if (
            customFieldDefinitions !== undefined
            && !isArray(customFieldDefinitions)
        ) {
            throw new Error('param "customFieldDefinitions" must be an array');
        }
        if (
            staticCreatePropSchemas !== undefined
            && !isPlainObject(staticCreatePropSchemas)
        ) {
            throw new Error('param "customSubChannelPropSchemas" must be a plain object');
        }
    }

    switch (op) {
        case 'create':
            return SingleChannelRecordCreateMessage(params);
        case 'patch':
            return SingleChannelRecordPatchMessage(params);
        default:
            throw new Error(`unknown message op "${op}"`);
    }

}

module.exports = SingleChannelRecordMessage;
