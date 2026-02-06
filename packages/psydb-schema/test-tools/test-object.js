'use strict';
var { ObjectFactory } = require('../src');

var TestObject = (...args) => (
    ObjectFactory({ systemType: 'TestObject', JSONSchema })(...args)
)

var JSONSchema = (jssKeywords) => {
    var { properties, required, ...pass } = jssKeywords;
    
    var schema = { type: 'object', properties, required, ...pass };
    return schema;
}

module.exports = TestObject;
