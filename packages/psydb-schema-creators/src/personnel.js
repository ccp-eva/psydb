'use strict';
var internals = require('./internals');

module.exports = {
    collection: 'systemRole',
    hasCustomTypes: false,
    subChannelStateSchemaCreators: {
        scientific: internals.PersonnelScientificState,
        gdpr: internals.PersonnelGdprState,
    },
    RecordMessage: internals.PersonnelRecordMessage 
}
