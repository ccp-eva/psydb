'use strict';
module.exports.CustomRecordTypeState = require('./custom-record-type/state');

module.exports.HelperSetState = require('./helper-set/state');
module.exports.HelperSetItemState = require('./helper-set-item/state');

module.exports.PersonnelScientificState = require('./personnel/scientific-state');
module.exports.PersonnelGdprState = require('./personnel/gdpr-state');
module.exports.PersonnelRecordMessage = require('./personnel/record-message');
    
//module.exports.SubjectScientificState = require('./subject/scientific-state');
//module.exports.SubjectGdprState = require('./subject/gdpr-state');
    
module.exports.LocationState = require('./location/state');
module.exports.LocationRecordMessage = require('./location/record-message');

module.exports.ResearchGroupState = require('./research-group/state');
module.exports.ResearchGroupRecordMessage = require('./research-group/record-message');

module.exports.SystemRoleState = require('./system-role/state');
module.exports.SystemRoleRecordMessage = require('./system-role/record-message');

module.exports.StudyState = require('./study/state');
module.exports.StudyRecordMessage = require('./study/record-message');

module.exports.ExperimentOperatorTeamState = require('./experiment-operator-team/state');
module.exports.ExperimentOperatorTeamRecordMessage = require('./experiment-operator-team/record-message');
