'use strict';
var internals = require('./internals');

module.exports = {
    collection: 'location',
    hasCustomTypes: true,
    State: internals.LocationState,
    RecordMessage: internals.LocationRecordMessage 
}
