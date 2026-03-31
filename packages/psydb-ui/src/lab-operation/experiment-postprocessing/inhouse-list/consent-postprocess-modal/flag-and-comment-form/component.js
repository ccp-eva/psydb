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
                label={ translate('Has Issue') }
                dataXPath='$.hasIssue'
                inverted={ true }
            />
            <Fields.ExtBool
                label={ translate('Has Data Update') }
                dataXPath='$.containsSubjectUpdate'
                inverted={ true }
            />
            <Fields.FullText
                label={ translate('Comment') }
                dataXPath='$.comment'
                rows={ 3 }
            />
        </>
    )
}
