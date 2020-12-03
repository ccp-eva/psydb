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
            ...fieldgroupProps,
        },
        required: [
            'enableMinimalReadAccess',
            ...Object.keys(fieldgroupProps)
        ]
    });
};

module.exports = FixedCollectionPermissions;
