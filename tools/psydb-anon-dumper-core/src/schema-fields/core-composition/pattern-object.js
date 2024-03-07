'use strict';
var jss = require('@mpieva/psydb-schema-fields');
var { SchemaFactory, commonTransformers } = require('../utils');

var PatternObject = (patternProperties, otherKeywords) => {
    var sharedBag = { patternProperties, ...otherKeywords };

    var MFSchema = SchemaFactory({
        JSONSchema: (jssKeywords) => {
            var { patternProperties, ...pass } = jssKeywords
            return jss.PatternObject(patternProperties, pass)
        },
        T: commonTransformers.object
    });
    
    return MFSchema(sharedBag)
}

module.exports = PatternObject;
