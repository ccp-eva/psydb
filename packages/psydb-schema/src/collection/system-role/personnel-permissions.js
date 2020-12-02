'use strict';
var inline = require('@cdxoo/inline-text'),
    FieldAccessMap = require('./util/field-access-map');

var PersonnelPermissions = ({
    stateSchema,
} = {}) => {
    var stateFieldAccess = FieldAccessMap({
        schema: stateSchema
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
            
            state: stateFieldAccess,
        },
        required: [
            'enableMinimalReadAccess',
            'state',
        ]
    });
};

module.exports = PersonnelPermissions;
