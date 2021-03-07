'use strict';

var stripArrayIndicationRegex = /\[\d+\]/g;

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

        var key = path.replace(stripArrayIndicationRegex, '');

        if (!this.foreignKeys[key]) {
            this.foreignKeys[key] = {
                ...keywordProps,
                values: [ data ],
            };
        }
        else {
            this.foreignKeys[key].values.push(data);
        }
    }
}

module.exports = foreignKey;
