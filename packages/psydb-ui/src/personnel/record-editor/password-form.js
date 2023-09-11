import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox
} from '@mpieva/psydb-ui-lib';

import { useSend } from '@mpieva/psydb-ui-hooks';

export const PasswordForm = (ps) => {
    var { id, fetched, onSuccessfulUpdate } = ps;
    var { record } = fetched;

    var translate = useUITranslation();

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
        labels: [
            translate('Generate Automatically'),
            translate('Set Manually')
        ],
    }

    return (
        <FormBox title={ translate('Change Staff Member Password')}>
            <DefaultForm
                initialValues={{ method: 'auto' }}
                onSubmit={ sendManualPassword.exec }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        { /*console.log(formikProps.values) || ''*/ }
                        <Fields.GenericEnum
                            label={ translate('Method') }
                            dataXPath='$.method'
                            enum={ methodEnum }
                            manualOnChange={ (e) => {
                                var { target: { value }} = e;
                                formikProps.setValues({ '$': {
                                    method: value,
                                    ...(value === 'manual' && {
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
                        <Button type='submit'>
                            { translate('Change Password') }
                        </Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}
