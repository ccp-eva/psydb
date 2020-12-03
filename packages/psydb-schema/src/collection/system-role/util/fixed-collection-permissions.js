'use strict';
var inline = require('@cdxoo/inline-text'),
    EnableMinimalReadAccess = require('./enable-minimal-read-access'),
    createFieldgroupProps = require('./util/create-fieldgroup-props');

var FixedCollectionPermissions = ({
    stateSchema,
    scientificSchema,
    gdprSchema,
} = {}) => {
    var fieldgroupProps = createFieldgroupProps({
        stateSchema,
        scientificSchema,
        gdprSchema,
    });

    return ({
        type: 'object',
        properties: {
            enableMinimalReadAccess: EnableMinimalReadAccess(),
            _state: {
                type: 'object',
                properties: fieldgroupProps,
                required: Object.keys(fieldgroupProps)
            }
        },
        required: [
            'enableMinimalReadAccess',
            '_state',
        ]
    });
};

module.exports = FixedCollectionPermissions;
