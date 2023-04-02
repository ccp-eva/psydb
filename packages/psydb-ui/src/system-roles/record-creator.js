import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import { MainForm } from './main-form';


const Defaults = () => {
    var LabOperation = ({ hasInvitation, type } = {}) => ({
        canWriteReservations: false,
        canSelectSubjectsForExperiments: false,
        ...(hasInvitation && {
            canConfirmSubjectInvitation: false,
        }),
        canViewExperimentCalendar: false,
        canMoveAndCancelExperiments: false,
        canChangeOpsTeam: false,
        canPostprocessExperiments: false,
        ...(type === 'away-team' && {
            canChangeExperimentStudy: false,
            canRemoveExperimentSubject: false,
        })
    });

    var Survey = () => ({
        canPerformOnlineSurveys: false,
    });

    return ({
        name: '',
        
        canReadLocations: false,
        canWriteLocations: false,
        canRemoveLocations: false,

        canReadExternalPersons: false,
        canWriteExternalPersons: false,
        canRemoveExternalPersons: false,

        canReadExternalOrganizations: false,
        canWriteExternalOrganizations: false,
        canRemoveExternalOrganizations: false,

        canReadStudyTopics: false,
        canWriteStudyTopics: false,
        canRemoveStudyTopics: false,

        canReadHelperSets: false,
        canWriteHelperSets: false,
        canRemoveHelperSets: false,

        canReadPersonnel: false,
        canWritePersonnel: false,
        canSetPersonnelPassword: false,

        canReadStudies: false,
        canWriteStudies: false,
        canRemoveStudies: false,

        canReadSubjects: false,
        canWriteSubjects: false,
        canRemoveSubjects: false,

        canReadParticipation: false,
        canWriteParticipation: false,
        
        canCreateReservationsWithinTheNext3Days: false,
        canCreateExperimentsWithinTheNext3Days: false,
        canUseExtendedSearch: false,
        canUseCSVExport: false,

        canViewReceptionCalendar:  false,
        labOperation: {
            'inhouse': LabOperation({ hasInvitation: true }),
            'away-team': LabOperation({ type: 'away-team' }),
            'online-video-call': LabOperation({ hasInvitation: true }),
            'online-survey': Survey(),
        }
    });
}

const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    var permissions = usePermissions();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    var initialValues = Defaults();

    return (
        <MainForm
            title='Neue System-Rolle'
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

