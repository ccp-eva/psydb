'use strict';
var getTreeNodeSubtypes = (schemaTreeNode) => (
    schemaTreeNode && schemaTreeNode.children
    ? schemaTreeNode.children
    : {}
);

module.exports = getTreeNodeSubtypes;
