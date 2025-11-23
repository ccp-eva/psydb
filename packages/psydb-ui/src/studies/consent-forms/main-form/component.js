import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var { subjectCRT, initialValues, onSubmit } = ps;
    var [{ translate }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <FormFields subjectCRT={ subjectCRT }/>
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { subjectCRT } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <Fields.SaneString
                label={ translate('Internal Name') }
                dataXPath='$.internalName'
                required
            />
            <Fields.SaneString
                label={ translate('Title') }
                dataXPath='$.title'
                required
            />
            <Fields.DefaultBool
                label={ translate('Is Enabled') }
                dataXPath='$.isEnabled'
                required
            />
        </>
    );
}
