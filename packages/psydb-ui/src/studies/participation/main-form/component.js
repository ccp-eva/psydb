import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';
import * as enums from '@mpieva/psydb-schema-enums';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var {
        subjectType,
        initialValues,
        onSubmit,
    } = ps;

    var renderedForm = (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    { /*console.log(formikProps.values) || ''*/ }
                    <FormFields subjectType={ subjectType } />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    );

    return renderedForm;
}

const FormFields = (ps) => {
    var { subjectType } = ps;
    return (
        <>
            <Fields.DateTime
                label='Test-Zeitpunkt'
                dataXPath='$.timestamp'
            />
            <Fields.ForeignId
                label='Proband'
                dataXPath='$.id'
                collection='subject'
                recordType={ subjectType }
            />
            <Fields.GenericEnum
                label='Beginn'
                dataXPath='$.status'
                options={{
                    ...enums.inviteParticipationStatus.mapping,
                    ...enums.inviteUnparticipationStatus.mapping,
                }}
            />
        </>
    );
}
