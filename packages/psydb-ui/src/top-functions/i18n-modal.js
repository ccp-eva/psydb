import React, { useState } from 'react';
import {
    useI18N,
} from '@mpieva/psydb-ui-contexts';

import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const I18NModal = WithDefaultModal({
    title: 'Language Settings',
    size: 'lg',
    Body: (ps) => {
        var { onHide } = ps;
        var [{ language, translate }, setI18N ] = useI18N();

        var handleSubmit = (formData, formikForm) => {
            setI18N({ ...formData });
            onHide();
        }

        return <Form onSubmit={ handleSubmit } />

    }
})

const Form = (ps) => {
    var { onSubmit } = ps;

    var [{ language, locale, translate }] = useI18N();

    var initialValues = {
        language,
        localeCode: locale.code
    };
    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {() => (
                <>
                    <Fields.GenericEnum
                        label={ translate('Language') }
                        dataXPath='$.language'
                        options={{
                            'en': 'English',
                            'de': 'Deutsch',
                        }}
                    />
                    <Fields.GenericEnum
                        label={ translate('Date/Time Format') }
                        dataXPath='$.localeCode'
                        options={{
                            'en-US': 'English (United States)',
                            'en-GB': 'English (Great Britain)',
                            'de': 'Deutsch',
                        }}
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    )
}
