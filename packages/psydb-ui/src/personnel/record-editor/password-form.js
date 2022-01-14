import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox
} from '@mpieva/psydb-ui-lib';

import { useSend } from '@mpieva/psydb-ui-hooks';

export const PasswordForm = (ps) => {
    var { id, fetched, onSuccessfulUpdate } = ps;
    var { record } = fetched.data;

    var sendManualPassword = useSend((formData) => ({
        type: 'set-personnel-password',
        payload: {
            id,
            lastKnownEventId: record.gdpr._lastKnownEventId,
            ...formData,
        }
    }), { onSuccessfulUpdate: () => demuxed([ onSuccessfulUpdate ])({ id })});

    var methodEnum = {
        keys: [ 'auto', 'manual' ],
        labels: [ 'automatisch erzeugen', 'manuell setzen' ],
    }

    return (
        <FormBox title='Mitarbeiter-Passwort ändern'>
            <DefaultForm
                initialValues={{ method: 'auto' }}
                onSubmit={ sendManualPassword.exec }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        <Fields.GenericEnum
                            label='Methode'
                            dataXPath='$.method'
                            enum={ methodEnum }
                            manualOnChange={ (e) => {
                                var { target: { value }} = e;
                                var key = methodEnum.keys[value];

                                formikProps.setValues({ '$': {
                                    method: key,
                                    ...(key === 'manual' && {
                                        sendMail: false,
                                    })
                                }}, false);
                            }}
                        />
                        { formikProps.values['$'].method === 'manual' && (
                            <>
                                <Fields.Password
                                    label='Neues Passwort'
                                    dataXPath='$.password'
                                    required
                                />
                                <Fields.DefaultBool
                                    label='per Mail senden'
                                    dataXPath='$.sendMail'
                                />
                            </>
                        )}
                        <Button type='submit'>Passwort ändern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}
