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
                required
            />
            <Bool
                label='kann Locations bearbeiten (Kigas, Räume, etc.)'
                dataXPath='$.canWriteLocations'
                required
            />
            <Bool
                label='kann Externe Personen einsehen (z.B. Ärzte)'
                dataXPath='$.canReadExternalPersons'
                required
            />
            <Bool
                label='kann Externe Personen bearbeiten (z.B. Ärzte)'
                dataXPath='$.canWriteExternalPersons'
                required
            />
            <Bool
                label='kann Externe Organisationen einsehen (z.B. Träger)'
                dataXPath='$.canReadExternalOrganizations'
                required
            />
            <Bool
                label='kann Externe Organisationen bearbeiten (z.B. Träger)'
                dataXPath='$.canWriteExternalOrganizations'
                required
            />
            <Bool
                label='kann Themengebiete einsehen'
                dataXPath='$.canReadStudyTopics'
                required
            />
            <Bool
                label='kann Themengebiete bearbeiten'
                dataXPath='$.canWriteStudyTopics'
                required
            />
            <Bool
                label='kann Hilfstabellen einsehen'
                dataXPath='$.canReadHelperSets'
                required
            />
            <Bool
                label='kann Hilfstabellen bearbeiten'
                dataXPath='$.canWriteHelperSets'
                required
            />
            <Bool
                label='kann Mitarbeiter einsehen (d.h. Benutzer-Accounts)'
                dataXPath='$.canReadPersonnel'
                required
            />
            <Bool
                label='kann Mitarbeiter bearbeiten (d.h. Benutzer-Accounts)'
                dataXPath='$.canWritePersonnel'
                required
            />
            <Bool
                label='kann das Passwort anderer Benutzer manuell neu setzen'
                dataXPath='$.canSetPersonnelPassword'
                required
            />
            <Bool
                label='kann Studien einsehen'
                dataXPath='$.canReadStudies'
                required
            />
            <Bool
                label='kann Studien anlegen und bearbeiten'
                dataXPath='$.canWriteStudies'
                required
            />
            <Bool
                label='kann Proband:innen einsehen'
                dataXPath='$.canReadSubjects'
                required
            />
            <Bool
                label='kann Proband:innen anlegen und bearbeiten'
                dataXPath='$.canWriteSubjects'
                required
            />
            <Bool
                label='kann einsehen welche Proband:innen an einer Studie teilgeommen haben'
                dataXPath='$.canReadParticipation'
                required
            />
            <Bool
                label='kann manuell Proband:innen in eine Studie eintragen'
                dataXPath='$.canWriteParticipation'
                required
            />
            <Bool
                label='kann Räume/Teams innerhalb der nächsten 3 Tage reservieren'
                dataXPath='$.canCreateReservationsWithinTheNext3Days'
                required
            />
            <Bool
                label='kann Termine innerhalb der nächsten 3 Tage machen'
                dataXPath='$.canCreateExperimentsWithinTheNext3Days'
                required
            />
            <Bool
                label='kann die Erweiterte Suche benutzen'
                dataXPath='$.canUseExtendedSearch'
                required
            />
            <Bool
                label='kann CSV-Export benutzen'
                dataXPath='$.canUseCSVExport'
                required
            />
            <Bool
                label='kann Rezeptionskalender einsehen'
                dataXPath='$.canViewReceptionCalendar'
                required
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
                required
            />
            <Bool
                label='kann Proband:innen für Termine auswählen'
                dataXPath={ `${dataXPath}.canSelectSubjectsForExperiments` }
                required
            />
            { hasInvitation && (
                <Bool
                    label='kann Termine bestätigen'
                    dataXPath={ `${dataXPath}.canConfirmSubjectInvitation` }
                    required
                />
            )}
            <Bool
                label='kann Terminkalender einsehen'
                dataXPath={ `${dataXPath}.canViewExperimentCalendar` }
                required
            />
            <Bool
                label='kann Termine verschieben und absagen'
                dataXPath={ `${dataXPath}.canMoveAndCancelExperiments` }
                required
            />
            <Bool
                label='kann Experimenter:innen-Teams ändern'
                dataXPath={ `${dataXPath}.canChangeOpsTeam` }
                required
            />
            <Bool
                label='kann Termine nachbereiten'
                dataXPath={ `${dataXPath}.canPostprocessExperiments` }
                required
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
                required
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
            required
            uiSplit={[ 8, 4 ]}
            { ...ps }
        />
    )
}
