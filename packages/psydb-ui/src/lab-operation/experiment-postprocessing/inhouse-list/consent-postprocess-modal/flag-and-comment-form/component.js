import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid, AsyncButton } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var { initialValues, onSubmit } = ps;
    var [{ translate }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {({ isSubmitting }) => (
                <div style={{ position: 'relative' }}>
                    <FormFields />
                    <div style={{ position: 'absolute', right: 0, top: 0 }}>
                        <AsyncButton
                            isTransmitting={ isSubmitting }
                            type='submit'
                        >
                            { translate('Save') }
                        </AsyncButton>
                    </div>
                </div>
            )}
        </DefaultForm>
    );
}

const FormFields = (ps) => {
    var [{ translate }] = useI18N();

    return (
        <>
            <Fields.ExtBool
                label={ translate('Contains Erroneous Information') }
                dataXPath='$.hasIssue'
                inverted={ true }
                helpText={ translate(
                    'Erroneous information was entered when filling out the consent form. This could be e.g. a typo, transposed digits or a very unlikely year of birth. Please describe the error in more detail in the comment.'
                )}
            />
            <Fields.ExtBool
                label={ translate('Contains New Information') }
                dataXPath='$.containsSubjectUpdate'
                inverted={ true }
                helpText={ translate(
                    'The consent form contains new information that has to be added to the subject\'s profile. This could be e.g. a new last name or a changed phone number.'
                )}
            />
            <Fields.FullText
                label={ translate('Comment') }
                dataXPath='$.comment'
                rows={ 3 }
            />
        </>
    )
}
