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
        type,
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
                            label={ translate('Label')}
                            dataXPath='$.label'
                        />
                        { type === 'edit' && (
                            <Fields.DefaultBool
                                label={ translate('Enabled')}
                                dataXPath='$.isEnabled'
                            />
                        )}
                        <Button type='submit'>
                            { translate('Save')}
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
        isEnabled: true,
        permissions: {}
    }
}

const out = {
    Component,
    createDefaults
}
export default out;
