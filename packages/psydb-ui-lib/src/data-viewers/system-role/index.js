import React from 'react';
import camelcase from 'camelcase';
import { createBase, withPair, addComponents } from '../core';
import {
    SaneString,
    FullText,
    DefaultBool,
} from '../utility-components';

const cc = (str) => camelcase(str, {
    pascalCase: true,
    preserveConsecutiveUppercase: true
})

const labOpsPath = (type, flag) => (
    `/state/labOperation/${type}/${flag}`
)

const inviteLabOpsLabels = (type) => ({
    [labOpsPath(type, 'canWriteReservations')]: (
        'Can Reserve Rooms'
    ),
    [labOpsPath(type, 'canSelectSubjectsForExperiments')]: (
        'Can Select Subjects for Appointments'
    ),
    [labOpsPath(type, 'canConfirmSubjectInvitation')]: (
        'Can Confirm Appointments'
    ),
    [labOpsPath(type, 'canViewExperimentCalendar')]: (
        'Can View Appointment Calendar'
    ),
    [labOpsPath(type, 'canMoveAndCancelExperiments')]: (
        'Can Move and Cancel Appointments'
    ),
    [labOpsPath(type, 'canChangeOpsTeam')]: (
        'Can Change Experimenter Teams'
    ),
    [labOpsPath(type, 'canPostprocessExperiments')]: (
        'Can Postprocess Appointments'
    ),
})

const awayTeamLabOpsLabels = (type) => ({
    [labOpsPath(type, 'canWriteReservations')]: (
        'Can Schedule Experimenter Teams'
    ),
    [labOpsPath(type, 'canSelectSubjectsForExperiments')]: (
        'Can Select Subjects for Appointments'
    ),
    [labOpsPath(type, 'canViewExperimentCalendar')]: (
        'Can View Appointment Calendar'
    ),
    [labOpsPath(type, 'canMoveAndCancelExperiments')]: (
        'Can Move and Cancel Appointments'
    ),
    [labOpsPath(type, 'canChangeOpsTeam')]: (
        'Can Change Experimenter Teams'
    ),
    [labOpsPath(type, 'canPostprocessExperiments')]: (
        'Can Postprocess Appointments'
    ),
    [labOpsPath(type, 'canChangeExperimentStudy')]: (
        'Can Change Study of Existing Appointments'
    ),
    [labOpsPath(type, 'canRemoveExperimentSubject')]: (
        'Can Remove Subjects from Existing Appointments'
    ),
});

const surveyLabOpsLabels = (type) => ({
    [labOpsPath(type, 'canPerformOnlineSurveys')]: (
        'Can Carry Out Only Surveys'
    ),
})

const labels = {
    '/sequenceNumber': 'ID No.',
    '/state/name': 'Name',

    '/state/canReadLocations': (
        'Can View Locations (Kigas, Rooms, etc.)'
    ),
    '/state/canWriteLocations': (
        'Can Edit Locations (Kigas, Rooms, etc.)'
    ),
    '/state/canRemoveLocations': (
        'Can Delete Locations (Kigas, Rooms, etc.)'
    ),

    '/state/canReadExternalPersons': (
        'Can View External Persons (e.g. Doctors)'
    ),
    '/state/canWriteExternalPersons': (
        'Can Edit External Persons (e.g. Doctors)'
    ),
    '/state/canRemoveExternalPersons': (
        'Can Delete External Persons (e.g. Doctors)'
    ),

    '/state/canReadExternalOrganizations': (
        'Can View External Organizations (e.g. Kiga Umbrella Orgs)'
    ),
    '/state/canWriteExternalOrganizations': (
        'Can Edit External Organizations (e.g. Kiga Umbrella Orgs)'
    ),
    '/state/canRemoveExternalOrganizations': (
        'Can Delete External Organizations (e.g. Kiga Umbrella Orgs)'
    ),

    '/state/canReadStudyTopics': (
        'Can View Study Topics'
    ),
    '/state/canWriteStudyTopics': (
        'Can Edit Study Topics'
    ),
    '/state/canRemoveStudyTopics': (
        'Can Delete Study Topics'
    ),

    '/state/canReadHelperSets': (
        'Can View Helper Tables'
    ),
    '/state/canWriteHelperSets': (
        'Can Edit Helper Tables'
    ),
    '/state/canRemoveHelperSets': (
        'Can Delete Helper Tables'
    ),

    '/state/canReadPersonnel': (
        'Can View Staff Members (i.e. User Accounts)'
    ),
    '/state/canWritePersonnel': (
        'Can Edit Staff Members (i.e. User Accounts)'
    ),
    '/state/canAllowLogin': (
        'Can Grant and Revoke Staff Members Log-In Permission'
    ),
    '/state/canSetPersonnelPassword': (
        'Can Set Password of Other Staff Members'
    ),

    '/state/canReadStudies': (
        'Can View Studies'
    ),
    '/state/canWriteStudies': (
        'Can Edit Studies'
    ),
    '/state/canRemoveStudies': (
        'Can Delete Studies'
    ),

    '/state/canReadSubjects': (
        'Can View Subjects'
    ),
    '/state/canWriteSubjects': (
        'Can Edit Subjects'
    ),
    '/state/canRemoveSubjects': (
        'Can Delete Subjects'
    ),

    '/state/canReadSubjectGroups': (
        'Can View Subject Groups'
    ),
    '/state/canWriteSubjectGroups': (
        'Can Edit Subject Groups'
    ),
    '/state/canRemoveSubjectGroups': (
        'Can Delete Subject Groups'
    ),

    '/state/canReadParticipation': (
        'Can View Study Participation'
    ),
    '/state/canWriteParticipation': (
        'Can Add Study Participations Manually'
    ),
    '/state/canViewStudyLabOpsSettings': (
        'Can View Lab Workflow Settings of Studies'
    ),
    '/state/canAccessSensitiveFields': (
        'Can Access Sensitive Fields (e.g. WKPRC-Comment)'
    ),
    '/state/canCreateReservationsWithinTheNext3Days': (
        'Can Reserve Rooms/Teams Within the Next 3 Days'
    ),
    '/state/canCreateExperimentsWithinTheNext3Days': (
        'Can Make Appointments Within the Next 3 Days'
    ),
    '/state/canUseExtendedSearch': (
        'Can Use Advanced Search'
    ),
    '/state/canUseCSVExport': (
        'Can Use CSV Export'
    ),
    '/state/canViewReceptionCalendar': (
        'Can View Receptionist Calendar'
    ),

    ...inviteLabOpsLabels('inhouse'),
    ...inviteLabOpsLabels('online-video-call'),
    ...awayTeamLabOpsLabels('away-team'),
    ...surveyLabOpsLabels('online-survey'),
}

const [ SystemRole, SystemRoleContext ] = createBase();
addComponents(SystemRole, SystemRoleContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    {
        cname: 'Name',
        path: '/state/name',
        Component: withPair(SaneString)
    },
    
    ...(
        Object.keys(labels)
        .filter(path => (
            !['/sequenceNumber', '/state/name'].includes(path)
            && !path.startsWith('/state/labOperation')
        ))
        .map(path => {
            var flag = path.split('/').pop();
            return {
                cname: cc(flag),
                path,
                Component: withPair(DefaultBool)
            }
        })
    ),

    ...(
        Object.keys(labels)
        .filter(path => path.startsWith('/state/labOperation'))
        .map(path => {
            var [ type, flag ] = path.split('/').slice(-2);

            return {
                cname: 'LabOperation' + cc(type) + cc(flag),
                path,
                Component: withPair(DefaultBool)
            }
        })
    )
]);

export default SystemRole;
