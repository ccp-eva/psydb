'use strict';
var internals = require('./internals');

module.exports = {
    collection: 'study',
    hasCustomTypes: true,
    State: internals.StudyState,
    RecordMessage: internals.StudyRecordMessage 
}
