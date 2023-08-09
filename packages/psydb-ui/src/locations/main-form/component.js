import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        title,
        fieldDefinitions,
        reservationType,
        initialValues,
        onSubmit,

        related,
        permissions,
    } = ps;

    return (
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
                enableReinitialize
            >
                {(formikProps) => (
                    <>
                        { /*console.log(formikProps.values) || ''*/ }
                        <FormFields
                            fieldDefinitions={ fieldDefinitions }
                            reservationType={ reservationType }
                            related={ related }
                            permissions={ permissions }
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { fieldDefinitions, related, permissions } = ps;
    var customFieldBag = {
        fieldDefinitions,
        related,
        extraTypeProps: {
            'PhoneWithTypeList': { enableFaxNumbers: true }
        }
    }
    return (
        <>
            <Fields.Custom { ...customFieldBag } />
            <Fields.FullText
                label='Kommentar'
                dataXPath='$.comment'
            />
            <ReservationFields { ...ps } />
            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}

const ReservationFields = (ps) => {
    var { reservationType, ...pass } = ps;
    switch (reservationType) {
        case 'no-reservation':
            return null
        case 'away-team':
            return <AwayTeamReservationFields { ...pass } />
        case 'inhouse':
        default:
            return <InhouseReservationFields { ...pass } />
    }
}

const AwayTeamReservationFields = (ps) => {
    var { related, permissions } = ps;
    var prefix = '$.reservationSettings';
    return (
        <>
            <Fields.WeekdayBoolObject
                label='Termine nicht am'
                dataXPath={`${prefix}.excludedExperimentWeekdays`}
            />
        </>
    );
}

const InhouseReservationFields = (ps) => {
    var { related, permissions } = ps;
    var prefix = '$.reservationSettings';
    return (
        <>
            <Fields.WeekdayBoolObject
                label='Wochentage'
                dataXPath={`${prefix}.possibleReservationWeekdays`}
            />
            <Fields.Time
                label='Reservierbar Von'
                dataXPath={`${prefix}.possibleReservationTimeInterval.start`}
            />
            <Fields.Time
                label='Reservierbar Bis'
                dataXPath={`${prefix}.possibleReservationTimeInterval.end`}
            />
        </>
    );
}
