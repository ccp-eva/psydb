'use strict';
var { ScalarFactory } = require('../src');

var TestScalar = (...args) => (
    ScalarFactory({ systemType: 'TestScalar', JSONSchema })(...args)
);

var JSONSchema = (jssKeywords) => {
    var { ...pass } = jssKeywords;
    
    var schema = { type: 'string', ...pass };
    return schema;
}

module.exports = TestScalar;
