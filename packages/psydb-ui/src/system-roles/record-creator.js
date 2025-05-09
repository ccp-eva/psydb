import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import { MainForm } from './main-form';


const Defaults = () => {
    var LabOperation = ({ type } = {}) => ({
        canWriteReservations: false,
        canSelectSubjectsForExperiments: false,
        ...(type === 'invite' && {
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
        canAllowLogin: false,
        canSetPersonnelPassword: false,

        canReadStudies: false,
        canWriteStudies: false,
        canRemoveStudies: false,

        canReadSubjects: false,
        canWriteSubjects: false,
        canRemoveSubjects: false,

        canReadSubjectGroups: false,
        canWriteSubjectGroups: false,
        canRemoveSubjectGroups: false,
        
        canReadParticipation: false,
        canWriteParticipation: false,
        canViewStudyLabOpsSettings: false,
        canAccessSensitiveFields: false,
        
        canCreateReservationsWithinTheNext3Days: false,
        canCreateExperimentsWithinTheNext3Days: false,
        canUseExtendedSearch: false,
        canUseCSVExport: false,

        canViewReceptionCalendar:  false,
        labOperation: {
            'inhouse': LabOperation({ type: 'invite' }),
            'away-team': LabOperation({ type: 'away-team' }),
            'online-video-call': LabOperation({ type: 'invite' }),
            'online-survey': Survey(),
        }
    });
}

const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    var initialValues = Defaults();

    return (
        <MainForm
            title={ translate('New System Role') }
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

