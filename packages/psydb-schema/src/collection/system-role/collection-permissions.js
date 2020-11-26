'use strict';
var RecordAccess = require('./record-access'),
    FieldAccess = require('./field-access');

var CollectionPermissions = () => ({
    type: 'object',
    properties: {
        recordAccess: RecordAccess(),
        fieldAccess: {
            type: 'array',
            default: [],
            items: FieldAccess(),
        },
        // TODO: in theory we could do schema access here as well
        // do we want that?
    },
});
