'use strict';
var jss = require('@mpieva/psydb-schema-fields');
var { SchemaFactory, commonTransformers } = require('../utils');

var PatternObject = (patternProperties, otherKeywords) => {
    var sharedBag = { patternProperties, ...otherKeywords };

    var PsydbSchema = SchemaFactory({
        JSONSchema: (jssKeywords) => {
            var { patternProperties, ...pass } = jssKeywords
            return jss.PatternObject(patternProperties, pass)
        },
        T: commonTransformers.object
    });
    
    return PsydbSchema(sharedBag)
}

module.exports = PatternObject;
