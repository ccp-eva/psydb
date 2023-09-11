import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

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
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { fieldDefinitions, related, permissions } = ps;
    
    var translate = useUITranslation();
    
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
                label={ translate('Comment') }
                dataXPath='$.comment'
            />
            <ReservationFields { ...ps } />
            <Fields.AccessRightByResearchGroupList
                label={ translate('Record Access for') }
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
    var translate = useUITranslation();
    var prefix = '$.reservationSettings';
    return (
        <>
            <Fields.WeekdayBoolObject
                label={ translate('Appointments Not on')}
                dataXPath={`${prefix}.excludedExperimentWeekdays`}
            />
        </>
    );
}

const InhouseReservationFields = (ps) => {
    var { related, permissions } = ps;
    var translate = useUITranslation();
    var prefix = '$.reservationSettings';
    return (
        <>
            <Fields.WeekdayBoolObject
                label={ translate('Weekdays') }
                dataXPath={`${prefix}.possibleReservationWeekdays`}
            />
            <Fields.Time
                label={ translate('Reservable From') }
                dataXPath={`${prefix}.possibleReservationTimeInterval.start`}
            />
            <Fields.Time
                label={ translate('Reservable To') }
                dataXPath={`${prefix}.possibleReservationTimeInterval.end`}
            />
        </>
    );
}
