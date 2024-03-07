'use strict';
var jss = require('@mpieva/psydb-schema-fields');
var { SchemaFactory, commonTransformers } = require('../utils');

var ExactObject = (properties, otherKeywords) => {
    var sharedBag = { properties, ...otherKeywords };

    var MFSchema = SchemaFactory({
        JSONSchema: (jssKeywords) => {
            var { properties, ...pass } = jssKeywords
            return jss.ExactObject(properties, pass)
        },
        T: commonTransformers.object
    });
    
    return MFSchema(sharedBag)
}

module.exports = ExactObject;
