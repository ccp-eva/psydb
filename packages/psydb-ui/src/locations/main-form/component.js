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
        <FormBox title={ title }>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
                useAjvAsync
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
        </FormBox>
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
        case 'away-team':
            return <AwayTeamReservationFields { ...pass } />
        case 'inhouse':
            return <InhouseReservationFields { ...pass } />
        case 'no-reservation':
        default:
            return null
    }
}

const AwayTeamReservationFields = (ps) => {
    var { related, permissions } = ps;
    var prefix = '$.reservationSettings';
    return (
        <>
            <Field.WeekdayBoolObject
                label='Termine nicht am'
                dataXPath={`${prefix}.excludeExperimentWeekdays`}
            />
        </>
    );
}

const InhouseReservationFields = (ps) => {
    var { related, permissions } = ps;
    var prefix = '$.reservationSettings';
    return (
        <>
            <Field.WeekdayBoolObject
                label='Wochentage'
                dataXPath={`${prefix}.possibleReservationWeekdays`}
            />
            <Field.Time
                label='Reservierbar Von'
                dataXPath={`${prefix}.possibleReservationTimeInterval.start`}
            />
            <Field.Time
                label='Reservierbar Bis'
                dataXPath={`${prefix}.possibleReservationTimeInterval.end`}
            />
        </>
    );
}
