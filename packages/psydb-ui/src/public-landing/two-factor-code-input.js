import React, { useState } from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { inlineText } from '@mpieva/psydb-common-lib';
import { demuxed } from '@mpieva/psydb-ui-utils';
import {
    useUIConfig,
    useUITranslation,
    useUILanguage
} from '@mpieva/psydb-ui-contexts';

import { useWriteRequest, useModalReducer } from '@mpieva/psydb-ui-hooks';

import { 
    AsyncButton,
    Button,
    SmallFormFooter,
    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import PublicLayout from './public-layout';

const TwoFactorCodeInput = (ps) => {
    var {
        onSignedIn, onSignedOut, isMismatch = false,
        authResponseStatus,
        onSuccessfulUpdate, onFailedUpdate,
    } = ps;

    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var config = useUIConfig();
    var translate = useUITranslation(); 
    
    var match = useWriteRequest((agent, formData) => {
        return agent.post('/api/two-factor-code/match', formData)
    }, { ...triggerBag });

    var back = useWriteRequest((agent, formData) => {
        return agent.post('/api/sign-out', formData)
    }, { ...triggerBag });

    var hasError = (authResponseStatus === 803);
    var initialValues = {
        twoFactorCode: '',
    }

    var renderedFooter = (
        <>
            <SmallFormFooter>
                <div className='pb-2'>
                    <TwoFactorCodeResender />
                </div>
                { hasError && (
                    <b className='text-danger'>
                        { translate('Invalid Code!') }
                    </b>
                )}
            </SmallFormFooter>
            
            <SmallFormFooter extraClassName='pt-3 mt-3 border-top'>
                <AsyncButton type='submit' { ...match.passthrough }>
                    { translate('Next') }
                </AsyncButton>
                <AsyncButton { ...back.passthrough }>
                    { translate('Back') }
                </AsyncButton>
            </SmallFormFooter>
        </>
    );

    return (
        <PublicLayout>
            <DefaultForm
                useAjvAsync
                ajvErrorInstancePathPrefix = ''
                initialValues={ initialValues }
                onSubmit={ match.exec }
            >
                {(formikProps) => (
                    <>
                        <InfoText />
                        
                        <Fields.SaneString
                            label={ translate('Code') }
                            dataXPath='$.twoFactorCode'
                            formGroupClassName='m-0'
                        />
                        
                        { renderedFooter }
                    </>
                )}
            </DefaultForm>
        </PublicLayout>
    )
}

const InfoText = () => {
    var translate = useUITranslation(); 
    return (
        <>
            <header><b>
                { translate('Two-Factor-Authentication Required') }
            </b></header>
            <p>{ translate(inlineText`
                You should have receved an e-mail containing a code,
                please enter it here.
            `) }</p>
        </>
    )
}

const TwoFactorCodeResender = () => {
    var translate = useUITranslation();
    var modal = useModalReducer();

    var resend = useWriteRequest((agent) => {
        return agent.post('/api/two-factor-code/resend')
    });

    return (
        <>
            <TwoFactorCodeResenderModal { ...modal.passthrough } />
            <small
                role='button'
                className='text-primary'
                onClick={ () => demuxed([
                    resend.exec,
                    modal.handleShow
                ])() }
            >
                { translate('Send New Code')}
            </small>
        </>
    )
}

const TwoFactorCodeResenderModalBody = (ps) => {
    var { onHide } = ps;
    var translate = useUITranslation();

    return (
        <div>
            <div>
                { translate('A new code was send to your e-mail. Please also check the junk folder.') }
            </div>
            <hr />
            <SmallFormFooter>
                <Button bsStyle='primary' onClick={() => onHide() }>
                    { translate('Close') }
                </Button>
            </SmallFormFooter>
        </div>
    )
}

const TwoFactorCodeResenderModal = WithDefaultModal({
    title: 'New Code Sent',
    Body: TwoFactorCodeResenderModalBody,
})

export default TwoFactorCodeInput
