'use strict';
var createTree = (list) => {
    var tree = {};

    list.forEach(item => {
        var {
            entity: entityKey,
            type: typeKey,
            subtype: subtypeKey,
            schemas
        } = item;

        if (!tree[entityKey]) {
            tree[entityKey] = { key: entityKey, children: {} };
        }
        var entity = tree[entityKey];

        if (!entity.children[typeKey]) {
            entity.children[typeKey] = { key: typeKey };
        }
        var type = entity.children[typeKey];
        
        if (subtypeKey) {
            if (!type.children) {
                type.children = {};
            }

            if (!type.children[subtypeKey]) {
                type.children[subtypeKey] = {
                    key: subtypeKey
                };
            }

            type.children[subtypeKey].schemas = schemas;
        }
        else {
            type.schemas = schemas;
        }
    });

    return tree;
}

module.exports = createTree;
