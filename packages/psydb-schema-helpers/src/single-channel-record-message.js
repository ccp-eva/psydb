'use strict';
var { isPlainObject } = require('is-what');

var {
    ExactObject,
    Id
} = require('@mpieva/psydb-schema-fields');

var createMessageType = require('./create-record-message-type'),
    Message = require('./message');

var SingleChannelRecordCreateMessage = ({
    collection,
    type,
    customFieldDefinitions,
    stateSchemaCreator,
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

    return Message({
        type: createMessageType({ collection, type, op: 'create' }),
        payload: ExactObject({
            properties: {
                id: Id(), // user can optionally force create id
                props: stateSchemaCreator({
                    enableInternalProps: false,
                    customFieldDefinitions
                }),
                
                ...staticCreatePropSchemas,

                required: [
                    ...staticCreatePropKeys,
                    'props',
                ]
            },
        })
    });
}

var SingleChannelRecordPatchMessage = ({
    collection,
    type,
    customFieldDefinitions,
    stateSchemaCreator,
}) => {
    return Message({
        type: createMessageType({ collection, type, op: 'patch' }),
        payload: ExactObject({
            properties: {
                id: Id(),
                props: stateSchemaCreator({
                    enableInternalProps: false,
                    customFieldDefinitions
                }),
                required: [
                    'id',
                    'props',
                ]
            },
        })
    });
}

var SingleChannelRecordMessage = (options) => {
    var {
        collection,
        type,
        op,
        staticCreatePropSchemas,

        customFieldDefinitions,
        stateSchemaCreator,
    } = params;

    if (!collection) {
        throw new Error('param "collection" is required');
    }
    if (!op) {
        throw new Error('param "op" is required');
    }
    if (!stateSchemaCreator) {
        throw new Error('param "stateSchemaCreator" is required');
    }
    if (
        customFieldDefinitions !== undefined
        && !isPlainObject(customFieldDefinitions)
    ) {
        throw new Error('param "customFieldDefinitions" must be a plain object');
    }
    if (
        staticCreatePropSchemas !== undefined
        && !isPlainObject(staticCreatePropSchemas)
    ) {
        throw new Error('param "customSubChannelPropSchemas" must be a plain object');
    }

    switch (op) {
        case 'create':
            return RecordCreateMessage(options);
        case 'patch':
            return RecordPatchMessage(options);
        default:
            throw new Error(`unknown message op "${op}"`);
    }

}

module.exports = SingleChannelRecordMessage;
