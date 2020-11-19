'use strict';
var derive = require('../../derive-helper'),
    LocationId = require('../id.schema.js').ref;

module.exports = derive(LocationId, 'psy-db/location/external-building/id');
