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
        customTypes: other,
        fixedTypes: {
            building,
            room,
        }
    });
};

module.exports = LocationPermissions;
