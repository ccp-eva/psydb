'use strict';
var inline = require('@cdxoo/inline-text'),
    Custom = require('./util/custom-collection-permissions'),
    CombinedTypePermissions = require('./util/combined-type-permissions');

var LocationPermissions = ({
    schemaTreeNode,
} = {}) => {
    var types = (
        schemaTreeNode
        ? schemaTreeNode.children
        : {}
    );
    
    var { building, room, ...other } = types;

    return Custom({
        types: {
            _building: building,
            _room: room,
            ...other,
        }
    });
};

module.exports = LocationPermissions;
