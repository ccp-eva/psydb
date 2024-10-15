'use strict';
var { StringEnum } = require('../system');
var { IANAZones } = require('@mpieva/psydb-timezone-helpers');

var Timezone = (keywords) => (
    StringEnum(IANAZones, {
        systemType: 'Timezone',
        ...keywords,
    })
)

module.exports = Timezone;

