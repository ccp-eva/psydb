import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
                        <Fields.SaneString
                            label={ translate('Display Name') }
                            dataXPath='$.label'
                            required
                        />
                        <Fields.SaneString
                            label={ translate('Display Name (DE)') }
                            dataXPath='$.displayNameI18N.de'
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

const createDefaults = (options) => {
    return {
        label: '',
        displayNameI18N: {},
    }
}

const out = {
    Component,
    createDefaults
}
export default out;
