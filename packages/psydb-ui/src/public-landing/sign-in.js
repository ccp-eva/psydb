import React, { useState } from 'react';
import {
    useUIConfig,
    useUITranslation,
    useUILanguage
} from '@mpieva/psydb-ui-contexts';

import { AsyncButton, SmallFormFooter } from '@mpieva/psydb-ui-layout';
import { useWriteRequest } from '@mpieva/psydb-ui-hooks';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import PublicLayout from './public-layout';

const SignIn = (ps) => {
    var {
        authResponseStatus,
        onSuccessfulUpdate,
        onFailedUpdate
    } = ps;

    var translate = useUITranslation(); 

    var write = useWriteRequest((agent, formData) => {
        return agent.post('/api/sign-in', formData)
    }, { 
        onSuccessfulUpdate,
        onFailedUpdate,
    });

    var hasError = (authResponseStatus === 400);
    var initialValues = {
        email: '',
        password: '',
    }
    return (
        <PublicLayout>
            <DefaultForm
                useAjvAsync
                ajvErrorInstancePathPrefix = ''
                initialValues={ initialValues }
                onSubmit={ write.exec }
                extraOKStatusCodes={[ 801, 803 ]}
            >
                {(formikProps) => (
                    <SignInFormBody
                        hasError={ hasError }
                        isTransmitting={ write.isTransmitting }
                    />
                )}
            </DefaultForm>
        </PublicLayout>
    )
}

const SignInFormBody = (ps) => {
    var { isTransmitting, hasError } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.Email
                label={ translate('E-Mail') }
                dataXPath='$.email'
            />
            <Fields.Password
                label={ translate('Password') }
                dataXPath='$.password'
            />
            <SmallFormFooter extraClassName='pt-2'>
                <AsyncButton type='submit' isTransmitting={ isTransmitting }>
                    { translate('Sign In') }
                </AsyncButton>
                { hasError && (
                    <span className='text-danger'>
                        { translate('Invalid authentication data!') }
                    </span>
                )}
            </SmallFormFooter>
        </>
    )
}
export default SignIn
