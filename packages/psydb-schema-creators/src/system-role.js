'use strict';
var internals = require('./internals');

module.exports = {
    collection: 'systemRole',
    hasCustomTypes: false,
    State: internals.SystemRoleState,
    RecordMessage: internals.SystemRoleRecordMessage 
}
