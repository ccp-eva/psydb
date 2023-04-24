import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

const Component = (ps) => {
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
                        <Fields.SaneString
                            label='Bezeichnung'
                            dataXPath='$.label'
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const createDefaults = (options) => {
    return {
        label: '',
        isEnabled: true,
        permissions: {}
    }
}

const out = {
    Component,
    createDefaults
}
export default out;
