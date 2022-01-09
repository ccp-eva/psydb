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

    return (
        <FormBox title='Mitarbeiter-Passwort ändern'>
            <DefaultForm
                onSubmit={ sendManualPassword.exec }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        <Fields.Password
                            label='Neues Passwort'
                            dataXPath='$.password'
                            required
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}
