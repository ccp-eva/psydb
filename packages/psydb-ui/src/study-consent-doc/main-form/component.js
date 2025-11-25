import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import ConsentDocElement from './consent-doc-element';

export const Component = (ps) => {
    var { studyConsentForm, subjectCRT, initialValues, onSubmit } = ps;
    var { title, titleI18N } = studyConsentForm.state;
    var [{ translate, language }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <h1>{ titleI18N?.[language] || title }</h1>
                    <hr />
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
}
