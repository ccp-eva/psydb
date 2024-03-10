'use strict';
var jss = require('@mpieva/psydb-schema-fields');
var { SchemaFactory, commonTransformers } = require('../utils');

var ClosedObject = (properties, otherKeywords) => {
    var sharedBag = { properties, ...otherKeywords };

    var PsydbSchema = SchemaFactory({
        JSONSchema: (jssKeywords) => {
            var { properties, ...pass } = jssKeywords
            return jss.ClosedObject(properties, pass)
        },
        T: commonTransformers.object
    });
    
    return PsydbSchema(sharedBag)
}

module.exports = ClosedObject;
