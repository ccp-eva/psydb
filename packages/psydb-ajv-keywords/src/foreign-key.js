'use strict';

var foreignKey = {
    modifying: false,
    schema: true,
    valid: true,
    validate: function (...args) {
        var [
            keywordProps, data, schema, path, parentData, key, rootData
        ] = args;
        //console.log(args);
        if (!this.foreignKeys) {
            this.foreignKeys = {}
        }

        this.foreignKeys[path] = keywordProps;
    }
}

module.exports = foreignKey;
