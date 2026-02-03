'use strict';
var { SchemaFactory, MFArraySchema } = require('../src');

var TestArray = (...args) => (
    SchemaFactory({
        CLASS: MFArraySchema, systemType: 'TestArray', JSONSchema, T
    })(...args)
);

var JSONSchema = (jssKeywords) => {
    var { items, ...pass } = jssKeywords;
    
    var schema = { type: 'array', items, ...pass };
    return schema;
}

var T = ({ mfschema, args }) => {
    var { keywords } = mfschema;
    var { items: itemsMFSchema } = keywords;

    // XXX
}

module.exports = TestArray;
