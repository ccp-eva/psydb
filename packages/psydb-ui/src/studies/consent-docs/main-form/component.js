import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import ConsentDocElement from './consent-doc-element';

export const Component = (ps) => {
    var { studyConsentForm, subjectCRT, initialValues, onSubmit } = ps;
    var [{ translate }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <FormFields
                        studyConsentForm={ studyConsentForm }
                        subjectCRT={ subjectCRT }
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
    var { studyConsentForm, subjectCRT } = ps;
    var [{ translate }] = useI18N();

    var { elements } = studyConsentForm.state;

    return (
        <>
            { elements.map((it, ix) => (
                <ConsentDocElement
                    { ...it } key={ ix } 
                    index={ ix } subjectCRT={ subjectCRT }
                />
            ))}
        </>
    )
    

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
