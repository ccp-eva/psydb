'use strict';
var bq = require('@cdxoo/block-quote');

module.exports = (definitions) => (
    Object.keys(definitions)
    .map(key => ({ type: key, properties: definitions[key]  }))
    .reduce((acc, { type, properties }) => (bq`
        ${acc}
        type ${type} {
            ${stringifyProperties(properties)}
        }
    `), '')
);

var stringifyProperties = (properties) => (
    Object.keys(properties)
    .map(key => ({ key, type: properties[key] }))
    .reduce((acc, { key, type }) => (bq`
        ${acc}
        ${key}: ${type}
    `), '')
);
