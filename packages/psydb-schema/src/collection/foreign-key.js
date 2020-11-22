'use strict';
var BaseId = require('./base-id.schema.js');

var ForeignKey = (collection, constraints) => {
    if (!collection) {
        throw new Error('missing collection parameter on foreign key creation');
    }
    return ({
        ...BaseId.schema,
        foreignKey: {
            collection,
            constraints: constraints || {},
        }
    });
}

module.exports = ForeignKey;
