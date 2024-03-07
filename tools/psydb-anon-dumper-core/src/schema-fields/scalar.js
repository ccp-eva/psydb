'use strict';
var jss = require('@mpieva/psydb-schema-fields/scalar');
var { SchemaFactory, commonTransformers } = require('./utils');

var schemas = {};
for (var key of Object.keys(jss)) {
    schemas[key] = SchemaFactory({
        JSONSchema: jss[key],
        T: commonTransformers.scalar
    })
}

// aliases
schemas.MongoId = schemas.Id;
schemas.MongoFk = schemas.ForeignId;

module.exports = schemas;
