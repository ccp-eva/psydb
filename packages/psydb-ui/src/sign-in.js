import React, { useState } from 'react';

import { Button } from '@mpieva/psydb-ui-layout';
import { useWriteRequest } from '@mpieva/psydb-ui-hooks';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

const SignInFormBody = (ps) => {
    var { hasError } = ps;
    return (
        <>
            <Fields.Email
                label='Email'
                dataXPath='$.email'
            />
            <Fields.Password
                label='Passwort'
                dataXPath='$.password'
            />
            <div className='d-flex justify-content-between align-items-center pt-2'>
                <div>
                    { hasError && (
                        <span className='text-danger'>
                            Ungültige Anmeldedaten!
                        </span>
                    )}
                </div>
                <Button type='submit'>
                    Anmelden
                </Button>
            </div>
        </>
    )
}

const SignIn = ({ onSignedIn }) => {
    var [ hasError, setHasError ] = useState(false);

    var write = useWriteRequest((agent, formData) => {
        return agent.post('/api/sign-in', formData)
    }, { 
        onSuccessfulUpdate: onSignedIn,
        onFailedUpdate: (error) => {
            if (error.response.status === 401) {
                setHasError(true);
            }
            else {
                throw error
            }
        }
    });

    return (
        <div 
            style={{
                minWidth: '500px',
                position: 'absolute',
                top: '38%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <h5
                className='pt-3 pb-3 pl-4 text-white m-0'
                style={{ background: '#006c66'}}
            >
                PsyDB Login
            </h5>
            <div className='p-4 bg-light border-left border-bottom border-right'>
                <DefaultForm
                    useAjvAsync
                    ajvErrorInstancePathPrefix = ''
                    initialValues={{ email: '', password: '' }}
                    onSubmit={ write.exec }
                >
                    {(formikProps) => (
                        <SignInFormBody hasError={ hasError } />
                    )}
                </DefaultForm>
            </div>
        </div>
    )
}

export default SignIn
