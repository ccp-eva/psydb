'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    MongoFk,
    DateTime,
    DefaultBool,
    DefaultInt,
    AnyString,
    NullValue,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'sequenceNumber': DefaultInt(),
        'isDummy': DefaultBool({ anonKeep: true }),

        'state': ClosedObject({
            'name': AnyString({ anonT: 'name' }),

            'canAccessSensitiveFields': DefaultBool({ anonKeep: true }),
            'canAllowLogin': DefaultBool({ anonKeep: true }),
            'canCreateExperimentsWithinTheNext3Days': DefaultBool({ anonKeep: true }),
            'canCreateReservationsWithinTheNext3Days': DefaultBool({ anonKeep: true }),
            'canReadExternalOrganizations': DefaultBool({ anonKeep: true }),
            'canReadExternalPersons': DefaultBool({ anonKeep: true }),
            'canReadHelperSets': DefaultBool({ anonKeep: true }),
            'canReadLocations': DefaultBool({ anonKeep: true }),
            'canReadParticipation': DefaultBool({ anonKeep: true }),
            'canReadPersonnel': DefaultBool({ anonKeep: true }),
            'canReadStudies': DefaultBool({ anonKeep: true }),
            'canReadStudyTopics': DefaultBool({ anonKeep: true }),
            'canReadSubjectGroups': DefaultBool({ anonKeep: true }),
            'canReadSubjects': DefaultBool({ anonKeep: true }),
            'canRemoveExternalOrganizations': DefaultBool({ anonKeep: true }),
            'canRemoveExternalPersons': DefaultBool({ anonKeep: true }),
            'canRemoveHelperSets': DefaultBool({ anonKeep: true }),
            'canRemoveLocations': DefaultBool({ anonKeep: true }),
            'canRemoveStudies': DefaultBool({ anonKeep: true }),
            'canRemoveStudyTopics': DefaultBool({ anonKeep: true }),
            'canRemoveSubjectGroups': DefaultBool({ anonKeep: true }),
            'canRemoveSubjects': DefaultBool({ anonKeep: true }),
            'canSetPersonnelPassword': DefaultBool({ anonKeep: true }),
            'canUseCSVExport': DefaultBool({ anonKeep: true }),
            'canUseExtendedSearch': DefaultBool({ anonKeep: true }),
            'canViewReceptionCalendar': DefaultBool({ anonKeep: true }),
            'canViewStudyLabOpsSettings': DefaultBool({ anonKeep: true }),
            'canWriteExternalOrganizations': DefaultBool({ anonKeep: true }),
            'canWriteExternalPersons': DefaultBool({ anonKeep: true }),
            'canWriteHelperSets': DefaultBool({ anonKeep: true }),
            'canWriteLocations': DefaultBool({ anonKeep: true }),
            'canWriteParticipation': DefaultBool({ anonKeep: true }),
            'canWritePersonnel': DefaultBool({ anonKeep: true }),
            'canWriteStudies': DefaultBool({ anonKeep: true }),
            'canWriteStudyTopics': DefaultBool({ anonKeep: true }),
            'canWriteSubjectGroups': DefaultBool({ anonKeep: true }),
            'canWriteSubjects': DefaultBool({ anonKeep: true }),

            'labOperation': ClosedObject({
                'away-team': ClosedObject({
                    'canChangeExperimentStudy': DefaultBool({ anonKeep: true }),
                    'canChangeOpsTeam': DefaultBool({ anonKeep: true }),
                    'canMoveAndCancelExperiments': DefaultBool({ anonKeep: true }),
                    'canPostprocessExperiments': DefaultBool({ anonKeep: true }),
                    'canRemoveExperimentSubject': DefaultBool({ anonKeep: true }),
                    'canSelectSubjectsForExperiments': DefaultBool({ anonKeep: true }),
                    'canViewExperimentCalendar': DefaultBool({ anonKeep: true }),
                    'canWriteReservations': DefaultBool({ anonKeep: true }),
                }),

                'inhouse': ClosedObject({
                    'canChangeOpsTeam': DefaultBool({ anonKeep: true }),
                    'canConfirmSubjectInvitation': DefaultBool({ anonKeep: true }),
                    'canMoveAndCancelExperiments': DefaultBool({ anonKeep: true }),
                    'canPostprocessExperiments': DefaultBool({ anonKeep: true }),
                    'canSelectSubjectsForExperiments': DefaultBool({ anonKeep: true }),
                    'canViewExperimentCalendar': DefaultBool({ anonKeep: true }),
                    'canWriteReservations': DefaultBool({ anonKeep: true }),
                }),
                'online-video-call': ClosedObject({
                    'canChangeOpsTeam': DefaultBool({ anonKeep: true }),
                    'canConfirmSubjectInvitation': DefaultBool({ anonKeep: true }),
                    'canMoveAndCancelExperiments': DefaultBool({ anonKeep: true }),
                    'canPostprocessExperiments': DefaultBool({ anonKeep: true }),
                    'canSelectSubjectsForExperiments': DefaultBool({ anonKeep: true }),
                    'canViewExperimentCalendar': DefaultBool({ anonKeep: true }),
                    'canWriteReservations': DefaultBool({ anonKeep: true }),
                }),
                'online-survey': ClosedObject({
                    'canPerformOnlineSurveys': DefaultBool({ anonKeep: true }),
                })
            })
        })
    })

    return schema;
}

module.exports = Schema;
