'use strict';
var derive = require('./derive-helper'),
    BaseId = require('../base-id.schema.js').ref;

module.exports = derive(BaseId, 'psy-db/institute/id');
