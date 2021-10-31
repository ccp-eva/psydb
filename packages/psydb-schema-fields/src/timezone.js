'use strict';
var StringEnum = require('./string-enum');
var { IANAZones } = require('@mpieva/psydb-timezone-helpers');

var Timezone = (keywords) => (
    StringEnum(IANAZones, {
        systemType: 'Timezone',
        ...keywords,
    })
)

module.exports = Timezone;

