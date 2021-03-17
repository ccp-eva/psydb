'use strict';
var internals = require('./internals'),
    metadata = require('./common/metadata');

module.exports = {
    customRecordType: {
        ...metadata.customRecordType,
        State: internals.CustomRecordTypeState,
    },
    helperSet: {
        ...metadata.helperSet,
        State: internals.HelperSetState,
    },
    helperSetItem: {
        ...metadata.helperSetItem,
        State: internals.HelperSetItemState,
    },
    experimentOperatorTeam: {
        ...metadata.experimentOperatorTeam,
        State: internals.ExperimentOperatorTeamState,
        RecordMessage: internals.ExperimentOperatorTeamRecordMessage 
    },
    location: {
        ...metadata.location,
        State: internals.LocationState,
        RecordMessage: internals.LocationRecordMessage 
    },
    personnel: {
        ...metadata.personnel,
        subChannelStateSchemaCreators: {
            scientific: internals.PersonnelScientificState,
            gdpr: internals.PersonnelGdprState,
        },
        RecordMessage: internals.PersonnelRecordMessage
    },
    researchGroup: {
        ...metadata.researchGroup,
        State: internals.ResearchGroupState,
        RecordMessage: internals.ResearchGroupRecordMessage 
    },
    study: {
        ...metadata.study,
        State: internals.StudyState,
        RecordMessage: internals.StudyRecordMessage 
    },
    subject: {
        ...metadata.subject,
        subChannelStateSchemaCreators: {
            scientific: internals.SubjectScientificState,
            gdpr: internals.SubjectGdprState,
        },
        RecordMessage: internals.SubjectRecordMessage
    },
    systemRole: {
        ...metadata.systemRole,
        State: internals.SystemRoleState,
        RecordMessage: internals.SystemRoleRecordMessage 
    },
}
