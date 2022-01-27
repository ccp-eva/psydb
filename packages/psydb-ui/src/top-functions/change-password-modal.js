import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { SelfContext } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button, Alert } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const ChangePasswordModal = WithDefaultModal({
    title: 'Passwort ändern',
    size: 'lg',
    Body: (ps) => {
        var { onHide } = ps;
        var [ wasSuccessful, setSuccessful ] = useState(false);
        var [ error, setError ] = useState();

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
                setError('Neues Passwort und wiederholung sind nicht identisch');
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
                            setError('Neues Passwort ist zu schwach.');
                        }
                    }
                    else if (apiStatus === 'PasswordMismatch') {
                        setError('Aktuelles Passwort ist ungültig.');
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

    var initialValues = {
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
    };
    return (
        <div>
            { error && (
                <Alert variant='danger'>
                    <b>Fehler:</b> { error }
                </Alert>
            )}
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
            >
                {() => (
                    <>
                        <Fields.Password
                            label='Aktuelles Passwort'
                            dataXPath='$.currentPassword'
                            required
                        />
                        <hr />
                        <Fields.Password
                            label='Neues Passwort'
                            dataXPath='$.newPassword'
                            required
                        />
                        <Fields.Password
                            label='Wiederholen'
                            dataXPath='$.newPasswordRepeat'
                            required
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </div>
    )
}

const SuccessIndicator = (ps) => {
    var { onHide } = ps;
    return (
        <>
            <Alert variant='success'>
                Passwort geändert!
            </Alert>
            <Button onClick={ onHide }>Schliessen</Button>
        </>
    )
}
