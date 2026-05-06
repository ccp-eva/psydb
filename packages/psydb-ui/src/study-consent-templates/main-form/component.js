import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import ConsentFormElementList from './consent-form-element-list';

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
                label={ translate('Template-Shorthand') }
                dataXPath='$.templateName'
                required
            />
            <Fields.SaneString
                label={ translate('Title for Subjects') }
                dataXPath='$.title'
                required
            />
            <Fields.DefaultBool
                label={ translate('Enabled') }
                dataXPath='$.isEnabled'
                required
            />
           
            <div className='px-3'>
                <ConsentFormElementList
                    label={ translate('Elements') }
                    dataXPath='$.elements'
                    enableMove={ true }
                    enableRemove={ true }
                    subjectCRT={ subjectCRT }
                />
            </div>
        </>
    );
}
