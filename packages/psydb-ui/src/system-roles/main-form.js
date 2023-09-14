import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

export const MainForm = (ps) => {
    var {
        title,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    var translate = useUITranslation();

    return (
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        <FormFields
                            related={ related }
                            permissions={ permissions }
                        />
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.SaneString
                label={ translate('Name') }
                dataXPath='$.name'
                required
            />

            <MainHeader>
                { translate('General Permissions') }
            </MainHeader>

            <PermBox title={ translate('Locations') }>
                <Bool
                    label='Can View Locations (Kigas, Rooms, etc.)'
                    dataXPath='$.canReadLocations'
                />
                <Bool
                    label='Can Edit Locations (Kigas, Rooms, etc.)'
                    dataXPath='$.canWriteLocations'
                />
                <Bool
                    label='Can Delete Locations (Kigas, Rooms, etc.)'
                    dataXPath='$.canRemoveLocations'
                />
            </PermBox>

            <PermBox title={ translate('External Persons') }>
                <Bool
                    label='Can View External Persons (e.g. Doctors)'
                    dataXPath='$.canReadExternalPersons'
                />
                <Bool
                    label='Can Edit External Persons (e.g. Doctors)'
                    dataXPath='$.canWriteExternalPersons'
                />
                <Bool
                    label='Can Delete External Persons (e.g. Doctors)'
                    dataXPath='$.canRemoveExternalPersons'
                />
            </PermBox>

            <PermBox title={ translate('External Organizations') }>
                <Bool
                    label='Can View External Organizations (e.g. Kiga Umbrella Orgs)'
                    dataXPath='$.canReadExternalOrganizations'
                />
                <Bool
                    label='Can Edit External Organizations (e.g. Kiga Umbrella Orgs)'
                    dataXPath='$.canWriteExternalOrganizations'
                />
                <Bool
                    label='Can Delete External Organizations (e.g. Kiga Umbrella Orgs)'
                    dataXPath='$.canRemoveExternalOrganizations'
                />
            </PermBox>

            <PermBox title={ translate('Study Topics') }>
                <Bool
                    label='Can View Study Topics'
                    dataXPath='$.canReadStudyTopics'
                />
                <Bool
                    label='Can Edit Study Topics'
                    dataXPath='$.canWriteStudyTopics'
                />
                <Bool
                    label='Can Delete Study Topics'
                    dataXPath='$.canRemoveStudyTopics'
                />
            </PermBox>

            <PermBox title={ translate('Helper Tables') }>
                <Bool
                    label='Can View Helper Tables'
                    dataXPath='$.canReadHelperSets'
                />
                <Bool
                    label='Can Edit Helper Tables'
                    dataXPath='$.canWriteHelperSets'
                />
                <Bool
                    label='Can Delete Helper Tables'
                    dataXPath='$.canRemoveHelperSets'
                />
            </PermBox>

            <PermBox title={ translate('Staff Members') }>
                <Bool
                    label='Can View Staff Members (i.e. User Accounts)'
                    dataXPath='$.canReadPersonnel'
                />
                <Bool
                    label='Can Edit Staff Members (i.e. User Accounts)'
                    dataXPath='$.canWritePersonnel'
                />
                <Bool
                    label='Can Grant and Revoke Staff Members Log-In Permission'
                    dataXPath='$.canAllowLogin'
                />
                <Bool
                    label='Can Set Password of Other Staff Members'
                    dataXPath='$.canSetPersonnelPassword'
                />
            </PermBox>

            <PermBox title={ translate('Studies') }>
                <Bool
                    label='Can View Studies'
                    dataXPath='$.canReadStudies'
                />
                <Bool
                    label='Can Edit Studies'
                    dataXPath='$.canWriteStudies'
                />
                <Bool
                    label='Can Delete Studies'
                    dataXPath='$.canRemoveStudies'
                />
            </PermBox>

            <PermBox title={ translate('Subjects') }>
                <Bool
                    label='Can View Subjects'
                    dataXPath='$.canReadSubjects'
                />
                <Bool
                    label='Can Edit Subjects'
                    dataXPath='$.canWriteSubjects'
                />
                <Bool
                    label='Can Delete Subjects'
                    dataXPath='$.canRemoveSubjects'
                />
            </PermBox>

            <PermBox title={ translate('Study Participation') }>
                <Bool
                    label='Can View Study Participation'
                    dataXPath='$.canReadParticipation'
                />
                <Bool
                    label='Can Add Study Participations Manually'
                    dataXPath='$.canWriteParticipation'
                />
            </PermBox>

            <PermBox title={ translate('General Scheduling') }>
                <Bool
                    label='Can Reserve Rooms/Teams Within the Next 3 Days'
                    dataXPath='$.canCreateReservationsWithinTheNext3Days'
                />
                <Bool
                    label='Can Make Appointments Within the Next 3 Days'
                    dataXPath='$.canCreateExperimentsWithinTheNext3Days'
                />
            </PermBox>

            <PermBox title={ translate('Advanced Functions') }>
                <Bool
                    label='Can Use Advanced Search'
                    dataXPath='$.canUseExtendedSearch'
                />
                <Bool
                    label='Can Use CSV Export'
                    dataXPath='$.canUseCSVExport'
                />
                <Bool
                    label='Can View Receptionist Calendar'
                    dataXPath='$.canViewReceptionCalendar'
                />
            </PermBox>

            <MainHeader>
                { translate('Lab Workflow Related Permissions') }
            </MainHeader>

            <LabOperationFields
                type='inhouse'
                title={ translate('Inhouse Appointments') }
                hasInvitation
            />
            <LabOperationFields
                type='away-team'
                title={ translate('External Appointments') }
            />
            <LabOperationFields
                type='online-video-call'
                title={ translate('Online Video Appointments') }
                hasInvitation
            />
            <SurveyFields
                type='online-survey'
                title={ translate('Online Survey') }
            />
        </>
    );
}

const LabOperationFields = (ps) => {
    var { type, title, hasInvitation } = ps;
    var dataXPath = `$.labOperation.${type}`;

    var translate = useUITranslation();

    return (
        <PermBox title={ title }>
            <Bool
                label={
                    hasInvitation
                        ? 'Can Reserve Rooms'
                        : 'Can Schedule Experimenter Teams'
                }
                dataXPath={ `${dataXPath}.canWriteReservations` }
            />
            <Bool
                label='Can Select Subjects for Appointments'
                dataXPath={ `${dataXPath}.canSelectSubjectsForExperiments` }
            />
            { hasInvitation && (
                <Bool
                    label='Can Confirm Appointments'
                    dataXPath={ `${dataXPath}.canConfirmSubjectInvitation` }
                />
            )}
            <Bool
                label='Can View Appointment Calendar'
                dataXPath={ `${dataXPath}.canViewExperimentCalendar` }
            />
            <Bool
                label='Can Move and Cancel Appointments'
                dataXPath={ `${dataXPath}.canMoveAndCancelExperiments` }
            />
            <Bool
                label='Can Change Experimenter Teams'
                dataXPath={ `${dataXPath}.canChangeOpsTeam` }
            />
            <Bool
                label='Can Postprocess Appointments'
                dataXPath={ `${dataXPath}.canPostprocessExperiments` }
            />
            { type === 'away-team' && (
                <Bool
                    label='Can Change Study of Existing Appointments'
                    dataXPath={ `${dataXPath}.canChangeExperimentStudy` }
                />
            )}
            { type === 'away-team' && (
                <Bool
                    label='Can Remove Subjects from Existing Appointments'
                    dataXPath={ `${dataXPath}.canRemoveExperimentSubject` }
                />
            )}
        </PermBox>
    )
}

const SurveyFields = (ps) => {
    var { type, title } = ps;
    var dataXPath = `$.labOperation.${type}`;

    var translate = useUITranslation();

    return (
        <PermBox title={ title }>
            <Bool
                label='Can Carry Out Only Surveys'
                dataXPath={ `${dataXPath}.canPerformOnlineSurveys` }
            />
        </PermBox>
    )
}

const MainHeader = (ps) => {
    var { children } = ps;
    return (
        <div className='row ml-0 mr-0'>
            <h5 className='col-sm-12 mt-4 mb-3 pb-1 border-bottom'>
                { children }
            </h5>
        </div>
    )
}

const Bool = (ps) => {
    var { label, ...pass } = ps;
    var translate = useUITranslation();
    return (
        <Fields.DefaultBool
            uiSplit={[ 8, 4 ]}
            label={ translate(label) }
            { ...pass }
        />
    )
}

const PermBox = (ps) => {
    var { title, children } = ps;
    return (
        <div className='row ml-0 mr-0'>
            <h6 className='col-sm-12 mb-0 pb-1'>
                { title }
            </h6>
            <div className='col-sm-12 border px-3 pt-3 mb-4'>
                { children }
            </div>
        </div>
    )
}
