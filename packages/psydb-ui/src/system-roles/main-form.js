import React from 'react';
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
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
    return (
        <>
            <Fields.SaneString
                label='Bezeichnung'
                dataXPath='$.name'
                required
            />
            <Bool
                label='kann Locations einsehen (Kigas, Räume, etc.)'
                dataXPath='$.canReadLocations'
            />
            <Bool
                label='kann Locations bearbeiten (Kigas, Räume, etc.)'
                dataXPath='$.canWriteLocations'
            />
            <Bool
                label='kann Externe Personen einsehen (z.B. Ärzte)'
                dataXPath='$.canReadExternalPersons'
            />
            <Bool
                label='kann Externe Personen bearbeiten (z.B. Ärzte)'
                dataXPath='$.canWriteExternalPersons'
            />
            <Bool
                label='kann Externe Organisationen einsehen (z.B. Träger)'
                dataXPath='$.canReadExternalOrganizations'
            />
            <Bool
                label='kann Externe Organisationen bearbeiten (z.B. Träger)'
                dataXPath='$.canWriteExternalOrganizations'
            />
            <Bool
                label='kann Themengebiete einsehen'
                dataXPath='$.canReadStudyTopics'
            />
            <Bool
                label='kann Themengebiete bearbeiten'
                dataXPath='$.canWriteStudyTopics'
            />
            <Bool
                label='kann Hilfstabellen einsehen'
                dataXPath='$.canReadHelperSets'
            />
            <Bool
                label='kann Hilfstabellen bearbeiten'
                dataXPath='$.canWriteHelperSets'
            />
            <Bool
                label='kann Mitarbeiter:innen einsehen (d.h. Benutzer-Accounts)'
                dataXPath='$.canReadPersonnel'
            />
            <Bool
                label='kann Mitarbeiter:innen bearbeiten (d.h. Benutzer-Accounts)'
                dataXPath='$.canWritePersonnel'
            />
            <Bool
                label='kann das Passwort anderer Benutzer manuell neu setzen'
                dataXPath='$.canSetPersonnelPassword'
            />
            <Bool
                label='kann Studien einsehen'
                dataXPath='$.canReadStudies'
            />
            <Bool
                label='kann Studien anlegen und bearbeiten'
                dataXPath='$.canWriteStudies'
            />
            <Bool
                label='kann Proband:innen einsehen'
                dataXPath='$.canReadSubjects'
            />
            <Bool
                label='kann Proband:innen anlegen und bearbeiten'
                dataXPath='$.canWriteSubjects'
            />
            <Bool
                label='kann einsehen welche Proband:innen an einer Studie teilgeommen haben'
                dataXPath='$.canReadParticipation'
            />
            <Bool
                label='kann manuell Proband:innen in eine Studie eintragen'
                dataXPath='$.canWriteParticipation'
            />
            <Bool
                label='kann Räume/Teams innerhalb der nächsten 3 Tage reservieren'
                dataXPath='$.canCreateReservationsWithinTheNext3Days'
            />
            <Bool
                label='kann Termine innerhalb der nächsten 3 Tage machen'
                dataXPath='$.canCreateExperimentsWithinTheNext3Days'
            />
            <Bool
                label='kann die Erweiterte Suche benutzen'
                dataXPath='$.canUseExtendedSearch'
            />
            <Bool
                label='kann CSV-Export benutzen'
                dataXPath='$.canUseCSVExport'
            />
            <Bool
                label='kann Rezeptionskalender einsehen'
                dataXPath='$.canViewReceptionCalendar'
            />

            <LabOperationFields
                type='inhouse'
                title='Interne Termine'
                hasInvitation
            />
            <LabOperationFields
                type='away-team'
                title='Externe Termine'
            />
            <LabOperationFields
                type='online-video-call'
                title='Online-Video-Termine'
                hasInvitation
            />
            <SurveyFields
                type='online-survey'
                title='Online-Umfrage'
            />
        </>
    );
}

const LabOperationFields = (ps) => {
    var { type, title, hasInvitation } = ps;
    var dataXPath = `$.labOperation.${type}`;

    return (
        <>
            <OpsHeader>{ title }</OpsHeader>
            <Bool
                label={
                    hasInvitation
                    ? 'kann Räumlichkeiten reservieren'
                    : 'kann Experimenter:innen-Teams planen'
                }
                dataXPath={ `${dataXPath}.canWriteReservations` }
            />
            <Bool
                label='kann Proband:innen für Termine auswählen'
                dataXPath={ `${dataXPath}.canSelectSubjectsForExperiments` }
            />
            { hasInvitation && (
                <Bool
                    label='kann Termine bestätigen'
                    dataXPath={ `${dataXPath}.canConfirmSubjectInvitation` }
                />
            )}
            <Bool
                label='kann Terminkalender einsehen'
                dataXPath={ `${dataXPath}.canViewExperimentCalendar` }
            />
            <Bool
                label='kann Termine verschieben und absagen'
                dataXPath={ `${dataXPath}.canMoveAndCancelExperiments` }
            />
            <Bool
                label='kann Experimenter:innen-Teams ändern'
                dataXPath={ `${dataXPath}.canChangeOpsTeam` }
            />
            <Bool
                label='kann Termine nachbereiten'
                dataXPath={ `${dataXPath}.canPostprocessExperiments` }
            />
        </>
    )
}

const SurveyFields = (ps) => {
    var { type, title } = ps;
    var dataXPath = `$.labOperation.${type}`;

    return (
        <>
            <OpsHeader>{ title }</OpsHeader>
            <Bool
                label='kann Online-Umfragen durchführen'
                dataXPath={ `${dataXPath}.canPerformOnlineSurveys` }
            />
        </>
    )
}

const OpsHeader = (ps) => {
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
    return (
        <Fields.DefaultBool
            uiSplit={[ 8, 4 ]}
            { ...ps }
        />
    )
}
