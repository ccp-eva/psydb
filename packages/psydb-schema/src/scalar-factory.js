'use strict';
var PsyDBScalarSchema = require('./psydb-scalar-schema');
var SchemaFactory = require('./schema-factory');
var commonTransformers = require('./common-transformers');

var ScalarFactory = (bag) => (
    SchemaFactory({
        CLASS: PsyDBScalarSchema, T: commonTransformers.scalar, ...bag
    })
);

module.exports = ScalarFactory;
