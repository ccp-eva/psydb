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
        FullSchema: internals.HelperSetFullSchema,
        State: internals.HelperSetState,
        RecordMessage: internals.HelperSetRecordMessage 
    },
    helperSetItem: {
        ...metadata.helperSetItem,
        State: internals.HelperSetItemState,
        FullSchema: internals.HelperSetItemFullSchema,
        RecordMessage: internals.HelperSetItemRecordMessage 
    },
    experimentOperatorTeam: {
        ...metadata.experimentOperatorTeam,
        State: internals.ExperimentOperatorTeamState,
        FullSchema: internals.ExperimentOperatorTeamFullSchema,
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
        FullSchema: internals.PersonnelFullSchema,
        RecordMessage: internals.PersonnelRecordMessage
    },
    researchGroup: {
        ...metadata.researchGroup,
        FullSchema: internals.ResearchGroupFullSchema,
        State: internals.ResearchGroupState,
        RecordMessage: internals.ResearchGroupRecordMessage 
    },
    study: {
        ...metadata.study,
        State: internals.StudyState,
        RecordMessage: internals.StudyRecordMessage 
    },
    studyTopic: {
        ...metadata.studyTopic,
        FullSchema: internals.StudyTopicFullSchema,
        State: internals.StudyTopicState,
        RecordMessage: internals.StudyTopicRecordMessage 
    },
    subject: {
        ...metadata.subject,
        FullSchema: internals.SubjectFullSchema,
        subChannelStateSchemaCreators: {
            scientific: internals.SubjectScientificState,
            gdpr: internals.SubjectGdprState,
        },
        RecordMessage: internals.SubjectRecordMessage
    },
    subjectGroup: {
        ...metadata.subjectGroup,
        FullSchema: internals.SubjectGroupFullSchema,
        State: internals.SubjectGroupState,
        RecordMessage: internals.SubjectGroupRecordMessage 
    },

    subjectSelector: {
        ...metadata.subjectSelector,
        State: internals.SubjectSelectorState,
        RecordMessage: internals.SubjectSelectorRecordMessage,
    },

    ageFrame: {
        ...metadata.ageFrame,
        State: internals.AgeFrameState,
        FullSchema: internals.AgeFrameFullSchema,
        RecordMessage: internals.AgeFrameRecordMessage,
    },

    systemRole: {
        ...metadata.systemRole,
        FullSchema: internals.SystemRoleFullSchema,
        State: internals.SystemRoleState,
        RecordMessage: internals.SystemRoleRecordMessage 
    },
    reservation: {
        ...metadata.reservation,
        fixedTypeStateSchemaCreators: {
            awayTeam: internals.AwayTeamReservationState,
            inhouse: internals.InhouseReservationState
        },
        FullSchema: internals.ReservationFullSchema,
    },

    experimentVariant: {
        ...metadata.experimentVariant,
        State: internals.ExperimentVariantState,
        RecordMessage: internals.ExperimentVariantRecordMessage,
    },

    experimentVariantSetting: {
        ...metadata.experimentVariantSetting,
        fixedTypeStateSchemaCreators: {
            'online-survey': internals.OnlineSurveyExperimentVariantSettingState,
            'online-video-call': internals.OnlineVideoCallExperimentVariantSettingState,
            'inhouse': internals.InhouseExperimentVariantSettingState,
            'away-team': internals.AwayTeamExperimentVariantSettingState,

            'apestudies-wkprc-default': (
                internals.ApestudiesWKPRCDefaultExperimentVariantSettingState
            ),
            'manual-only-participation': (
                internals.ManualOnlyParticipationExperimentVariantSettingState
            ),
        }
    },

    experiment: {
        ...metadata.experiment,
        FullSchema: internals.ExperimentFullSchema,
        State: internals.ExperimentState,
    },

    externalOrganization: {
        ...metadata.externalOrganization,
        State: internals.ExternalOrganizationState,
        RecordMessage: internals.ExternalOrganizationMessage 
    },

    externalPerson: {
        ...metadata.externalPerson,
        State: internals.ExternalPersonState,
        RecordMessage: internals.ExternalPersonMessage 
    },

    apiKey: {
        ...metadata.apiKey,
        FullSchema: internals.ApiKeyFullSchema,
        State: internals.ApiKeyState,
    },
}
