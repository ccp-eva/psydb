'use strict';
var { isPlainObject } = require('is-what');

var SingleChannelRecordMessage = (options) => {
    var {
        collection,
        type,
        op,
        staticCreatePropSchemas,

        customPropSchemas,
        createStateSchemaCallback,
    } = params;

    if (!collection) {
        throw new Error('param "collection" is required');
    }
    if (!op) {
        throw new Error('param "op" is required');
    }
    if (!createStateSchemaCallback) {
        throw new Error('param "createStateSchemaCallback" is required');
    }
    if (
        customStateSchema !== undefined
        && !isPlainObject(customPropSchemas)
    ) {
        throw new Error('param "customPropSchemas" must be a plain object');
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
