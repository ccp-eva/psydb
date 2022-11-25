import React, { useState } from 'react';

import { Button } from '@mpieva/psydb-ui-layout';
import { useWriteRequest } from '@mpieva/psydb-ui-hooks';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import logoTextColor from './mp-logo-farbig-rgb.svg';

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
                top: '34%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/*<h5
                className='pt-3 pb-3 pl-4 text-white m-0'
                style={{ background: '#006c66'}}
            >
                PsyDB Login
            </h5>*/}
            <div 
                //className='border-top border-left border-right'
                style={{
                    borderBottom: '2px solid #006c66'
                }}
            >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <h5
                        className='py-2 m-0 border-top text-muted'
                        style={{
                            textAlign: 'right',
                            width: '310px',
                            position: 'absolute',
                            right: 0,
                            bottom: '5px',
                            paddingLeft: '20px',
                            paddingRight: '30px',
                            //background: '#006c66'
                            //color: '#006c66',
                            //color: '#555'
                        }}
                    >
                        PsyDB Login
                    </h5>
                    <img
                        style={{
                            marginLeft: '-20px',
                            marginRight: '-20px',
                            marginTop: '-30px',
                            //marginBottom: '-20px',
                            marginBottom: '-25px',
                        }}
                        src={ logoTextColor } alt=''
                    />
                </div>
            </div>
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
