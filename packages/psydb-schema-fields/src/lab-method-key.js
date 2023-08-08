'use strict';
var { labMethods } = require('@mpieva/psydb-schema-enums');
var StringEnum = require('./string-enum');

var LabMethodKey = (bag) => (
    StringEnum(labMethods.keys, bag)
)

module.exports = LabMethodKey;
