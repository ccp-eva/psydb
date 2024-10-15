'use strict';
var { labMethods } = require('@mpieva/psydb-schema-enums');
var { StringEnum } = require('../system');

var LabMethodKey = (bag) => (
    StringEnum(labMethods.keys, bag)
)

module.exports = LabMethodKey;
