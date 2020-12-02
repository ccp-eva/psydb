'use strict';
var inline = require('@cdxoo/inline-text'),
    CombinedTypePermissions = require('./util/combined-type-permissions');

var LocationPermissions = ({
    schemaTreeNodes,
} = {}) => {
    var { building, room, ...other } = schemaTreeNodes;

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
            
            ...(building && {
                building: CombinedTypePermissions({
                    schemaTreeNodes: building.children
                })
            }),
            ...(room && {
                building: CombinedTypePermissions({
                    schemaTreeNodes: room.children
                })
            }),
            ...(Object.keys(other).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: CombinedtypePermissions({
                        schemaTreeNodes: other[key].children
                    })
                }),
                {}
            ))
        },
        required: [
            'enableMinimalReadAccess',
            ...(building ? [ 'building' ] : []),
            ...(room ? [ 'room' ] : []),
            ...Object.keys(other),
        ]
    });
};

module.exports = LocationPermissions;
