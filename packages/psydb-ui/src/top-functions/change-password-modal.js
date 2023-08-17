import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useUITranslation, SelfContext } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button, Alert } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const ChangePasswordModal = WithDefaultModal({
    title: 'Change Password',
    size: 'lg',
    Body: (ps) => {
        var { onHide } = ps;
        var [ wasSuccessful, setSuccessful ] = useState(false);
        var [ error, setError ] = useState();
        
        var translate = useUITranslation();

        var send = useSend((payload) => ({
            type: 'self/set-password',
            payload,
        }), {
            onSuccessfulUpdate: () => setSuccessful(true),
            disableErrorModal: true,
        })

        var handleSubmit = (formData, formikForm) => {
            var {
                currentPassword,
                newPassword,
                newPasswordRepeat
            } = formData;

            if (newPassword !== newPasswordRepeat) {
                setError(translate('New password and repeated are not the same!'));
                return; // FIXME: withAjvError does not handle that properly
            }

            return send.exec({
                currentPassword,
                newPassword,
            }).catch(err => {
                if (err.response && err.response.data) {
                    var { apiStatus, data } = err.response.data;
                    if (apiStatus === 'InvalidMessageSchema') {
                        var { ajvErrors } = data;

                        var newPasswordError = ajvErrors.find(it => (
                            it.dataPath === '.payload.newPassword'
                        ))
                        if (newPasswordError) {
                            setError(translate('New password is too weak!'));
                        }
                    }
                    else if (apiStatus === 'PasswordMismatch') {
                        setError(translate('Current password is invalid!'));
                    }
                    else {
                        throw err;
                    }
                }
            })
        }

        return (
            wasSuccessful
            ? <SuccessIndicator onHide={ onHide } />
            : <Form error={ error } onSubmit={ handleSubmit } />
        )

    }
})

const Form = (ps) => {
    var { error, onSubmit } = ps;

    var translate = useUITranslation();

    var initialValues = {
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
    };
    return (
        <div>
            { error && (
                <Alert variant='danger'>
                    <b>{ translate('Error') }:</b> { error }
                </Alert>
            )}
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
            >
                {() => (
                    <>
                        <Fields.Password
                            label={ translate('Current Password') }
                            dataXPath='$.currentPassword'
                            required
                        />
                        <hr />
                        <Fields.Password
                            label={ translate('New Password') }
                            dataXPath='$.newPassword'
                            required
                        />
                        <Fields.Password
                            label={ translate('Repeat New Password') }
                            dataXPath='$.newPasswordRepeat'
                            required
                        />
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </>
                )}
            </DefaultForm>
        </div>
    )
}

const SuccessIndicator = (ps) => {
    var { onHide } = ps;
    var translate = useUITranslation();

    return (
        <>
            <Alert variant='success'>
                { translate('Password changed!') }
            </Alert>
            <Button onClick={ onHide }>{ translate('Close') }</Button>
        </>
    )
}
