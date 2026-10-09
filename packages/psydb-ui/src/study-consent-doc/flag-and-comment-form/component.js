import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';
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
                <>
                    <FormFields />
                    <AsyncButton
                        isTransmitting={ isSubmitting }
                        type='submit'
                    >
                        { translate('Save') }
                    </AsyncButton>
                </>
            )}
        </DefaultForm>
    );
}

const FormFields = (ps) => {
    var [{ translate }] = useI18N();

    return (
        <>
            <Fields.ExtBool
                label={ translate('Contains Errors') }
                dataXPath='$.hasIssue'
                inverted={ true }
                helpText={ translate(
                    'For when the form contains erroneous data.'
                )}
            />
            <Fields.ExtBool
                label={ translate('Has New Infos') }
                dataXPath='$.containsSubjectUpdate'
                inverted={ true }
                helpText={ translate(
                    'For when the form contains new info to update in the data sheet.'
                )}
            />
            <Fields.FullText
                label={ translate('Comment') }
                dataXPath='$.comment'
            />
        </>
    )
}
