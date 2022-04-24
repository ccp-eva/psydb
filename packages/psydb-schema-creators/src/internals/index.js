'use strict';
module.exports.CustomRecordTypeState = require('./custom-record-type/state');

module.exports.HelperSetFullSchema = require('./helper-set/full-schema');
module.exports.HelperSetState = require('./helper-set/state');
module.exports.HelperSetRecordMessage = require('./helper-set/record-message');

module.exports.HelperSetItemState = require('./helper-set-item/state');
module.exports.HelperSetItemFullSchema = require('./helper-set-item/full-schema');
module.exports.HelperSetItemRecordMessage = require('./helper-set-item/record-message');

module.exports.PersonnelScientificState = require('./personnel/scientific-state');
module.exports.PersonnelGdprState = require('./personnel/gdpr-state');
module.exports.PersonnelRecordMessage = require('./personnel/record-message');
module.exports.PersonnelFullSchema = require('./personnel/full-schema');
    
module.exports.SubjectScientificState = require('./subject/scientific-state');
module.exports.SubjectGdprState = require('./subject/gdpr-state');
module.exports.SubjectRecordMessage = require('./subject/record-message');
    
module.exports.SubjectSelectorState = require('./subject-selector/state');
module.exports.SubjectSelectorRecordMessage = require('./subject-selector/record-message');

module.exports.AgeFrameState = require('./age-frame/state');
module.exports.AgeFrameFullSchema = require('./age-frame/full-schema');
module.exports.AgeFrameRecordMessage = require('./age-frame/record-message');

module.exports.LocationState = require('./location/state');
module.exports.LocationRecordMessage = require('./location/record-message');

module.exports.ResearchGroupFullSchema = require('./research-group/full-schema');
module.exports.ResearchGroupState = require('./research-group/state');
module.exports.ResearchGroupRecordMessage = require('./research-group/record-message');

module.exports.SystemRoleState = require('./system-role/state');
module.exports.SystemRoleRecordMessage = require('./system-role/record-message');

module.exports.StudyState = require('./study/state');
module.exports.StudyRecordMessage = require('./study/record-message');

module.exports.StudyTopicState = require('./study-topic/state');
module.exports.StudyTopicRecordMessage = require('./study-topic/record-message');

module.exports.ExperimentOperatorTeamState = require('./experiment-operator-team/state');
module.exports.ExperimentOperatorTeamFullSchema = require('./experiment-operator-team/full-schema');
module.exports.ExperimentOperatorTeamRecordMessage = require('./experiment-operator-team/record-message');

module.exports.AwayTeamReservationState = require('./reservation/away-team-state');
module.exports.InhouseReservationState = require('./reservation/inhouse-state');
module.exports.ReservationFullSchema = require('./reservation/full-schema');

module.exports.ExperimentState = require('./experiment/state');
module.exports.ExperimentFullSchema = require('./experiment/full-schema');
module.exports.ExperimentVariantState = require('./experiment-variant/state');
module.exports.ExperimentVariantRecordMessage = require('./experiment-variant/record-message');

module.exports.ExternalOrganizationState = require('./external-organization/state');
module.exports.ExternalOrganizationMessage = require('./external-organization/record-message');

module.exports.ExternalPersonState = require('./external-person/state');
module.exports.ExternalPersonMessage = require('./external-person/record-message');
            
module.exports.SubjectGroupFullSchema = require('./subject-group/full-schema');
module.exports.SubjectGroupState = require('./subject-group/state');
module.exports.SubjectGroupRecordMessage = require('./subject-group/record-message');


module.exports.OnlineSurveyExperimentVariantSettingState = (
    require('./experiment-variant-setting/online-survey-state')
);
module.exports.OnlineVideoCallExperimentVariantSettingState = (
    require('./experiment-variant-setting/online-video-call-state')
);
module.exports.InhouseExperimentVariantSettingState = (
    require('./experiment-variant-setting/inhouse-state')
);
module.exports.AwayTeamExperimentVariantSettingState = (
    require('./experiment-variant-setting/away-team-state')
)
