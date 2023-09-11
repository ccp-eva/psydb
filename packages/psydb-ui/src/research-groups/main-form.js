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
                label={ translate('_designation') }
                dataXPath='$.name'
                required
            />
            <Fields.SaneString
                label={ translate('Shorthand') }
                dataXPath='$.shorthand'
                required
            />
            <Fields.Address
                label={ translate('Address') }
                dataXPath='$.address'
            />
            <Fields.FullText
                label={ translate('Description') }
                dataXPath='$.description'
            />
        </>
    );
}
