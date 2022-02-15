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
            <Fields.SaneString
                label='Kürzel'
                dataXPath='$.shorthand'
                required
            />
            <Fields.Address
                label='Adresse'
                dataXPath='$.address'
            />
            <Fields.FullText
                label='Beschreibung'
                dataXPath='$.description'
            />
        </>
    );
}
