'use strict';
var inline = require('@cdxoo/inline-text'),
    createFieldgroupProps = require('./create-fieldgroup-props');

var PersonnelPermissions = ({
    scientificSchema,
    gdprSchema,
} = {}) => {
    var stateFieldAccess = FieldAccessMap({
        schema: stateSchema
    });

    var fieldgroupProps = createFieldgroupProps({
        scientificSchema,
        gdprSchema,
    });

    return ({
        type: 'object',
        properties: {
            enableMinimalReadAccess: {
                type: 'bool',
                default: false,
                description: inline`
                    grants access to search items by id and
                    read the attribute designated as label;
                    needs to be enabled in order to read/write
                    foreign key fields pointing to this collection
                `,
            },
            ...fieldgroupProps,
        },
        required: [
            'enableMinimalReadAccess',
            ...Object.keys(fieldgroupProps)
        ]
    });
};

module.exports = PersonnelPermissions;
