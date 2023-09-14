import React, { useState } from 'react';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';

import { Button } from '@mpieva/psydb-ui-layout';
import { useWriteRequest } from '@mpieva/psydb-ui-hooks';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import logoDETextColor from './mp-logo-farbig-rgb.svg';
import logoENTextColor from './mp-logo-en-farbig-rgb.svg';

const logosByLanguage = {
    'en': logoENTextColor,
    'de': logoDETextColor,
}

const SignInFormBody = (ps) => {
    var { hasError } = ps;
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
            <div className='d-flex justify-content-between align-items-center pt-2'>
                <div>
                    { hasError && (
                        <span className='text-danger'>
                            { translate('Invalid authentication data!') }
                        </span>
                    )}
                </div>
                <Button type='submit'>
                    { translate('Sign In') }
                </Button>
            </div>
        </>
    )
}

const SignIn = ({ onSignedIn }) => {
    var translate = useUITranslation(); 
    
    var [ language ] = useUILanguage();
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
                            width: '315px',
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
                        { translate('PsyDB Sign In') }
                    </h5>
                    <img
                        style={{
                            marginLeft: '-20px',
                            marginRight: '-20px',
                            marginTop: '-30px',
                            //marginBottom: '-20px',
                            marginBottom: '-25px',
                        }}
                        src={ logosByLanguage[language] } alt=''
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
            <div className='mt-1 d-flex justify-content-end'>
                <span>{ translate('Language') }:</span>
                <LangButton code='en' />
                <LangButton code='de' />
            </div>
        </div>
    )
}

const LangButton = (ps) => {
    var { code } = ps;
    var [ language, setLanguage ] = useUILanguage();
    
    var isActive = ( language === code );

    var className = (
        isActive
        ? 'ml-2 text-primary text-bold cursor-default'
        : 'ml-2 text-primary cursor-pointer'
    );

    var onClick = (
        isActive
        ? undefined
        : () => setLanguage(code)
    );

    var bag = {
        className,
        onClick
    }

    return (
        <span { ...bag  }>{ code.toUpperCase() }</span>
    )
}

export default SignIn
