import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import { MainForm } from './main-form';


const Defaults = () => {
    var LabOperation = ({ hasInvitation } = {}) => ({
        canWriteReservations: false,
        canSelectSubjectsForExperiments: false,
        ...(hasInvitation && {
            canConfirmSubjectInvitation: false,
        }),
        canViewExperimentCalendar: false,
        canMoveAndCancelExperiments: false,
        canChangeOpsTeam: false,
        canPostprocessExperiments: false,
    });

    var Survey = () => ({
        canPerformOnlineSurveys: false,
    });

    return ({
        name: '',
        
        canWriteLocations: false,
        canWriteExternalPersons: false,
        canWriteExternalOrganizations: false,
        canWriteStudyTopics: false,
        canWriteHelperSets: false,
        canWritePersonnel: false,
        canSetPersonnelPassword: false,

        canReadStudies: false,
        canWriteStudies: false,
        canReadSubjects: false,
        canWriteSubjects: false,
        canReadParticipation: false,
        canWriteParticipation: false,
        
        canCreateReservationsWithinTheNext3Days: false,
        canCreateExperimentsWithinTheNext3Days: false,
        canUseExtendedSearch: false,
        canUseCSVExport: false,

        canViewReceptionCalendar:  false,
        labOperation: {
            'inhouse': LabOperation({ hasInvitation: true }),
            'away-team': LabOperation(),
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

