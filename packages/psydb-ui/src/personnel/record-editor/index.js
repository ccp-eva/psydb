import React from 'react';

import {
    DefaultForm,
    Fields,
    FormBox
} from '@mpieva/psydb-ui-lib';

import {
    useModalReducer,
    usePermissions,
    useSend
} from '@mpieva/psydb-ui-hooks';

import { withRecordEditor } from './with-record-editor';

const EditForm = (ps) => {
    var {
        collection,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var {
        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
        schema
    } = fetched.data;

    var setPasswordModal = useModalReducer();
    var send = useSend((formData) => ({
        type: `${collection}/patch`,
        payload: {
            id,
            lastKnownSubChannelEventIds: {
                ...(record.scientific && {
                    scientific: record.scientific._lastKnownEventId,
                }),
                ...(record.gdpr && {
                    gdpr: record.gdpr._lastKnownEventId,
                }),
            },
            props: formData,
        }
    }), { onSuccessfulUpdate });

    return (
        <FormBox title='Mitarbeiter bearbeiten'>
            <DefaultForm
                initialValues={{
                    gdpr: record.gdpr.state,
                    scientific: record.gdpr.state,
                }}
                onSubmit={ send.exec }
                useAjvAsync
            >
                {(formikProps) => (
                    <FormFields /> 
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    return (
        <>
            <Fields.SaneString
                label='Vorname'
                dataXPath='$.gdpr.firstname'
                required
            />
            <Fields.SaneString
                label='Nachname'
                dataXPath='$.gdpr.lastname'
                required
            />
            <Fields.SaneString
                label='Kürzel'
                dataXPath='$.gdpr.shorthand'
                required
            />
            <Fields.EmailWithPrimaryList
                label='Emails'
                dataXPath='$.gdpr.emails'
                required
            />
            <Fields.PhoneWithTypeList
                label='Telefon'
                dataXPath='$.gdpr.phones'
                required
            />
        </>
    );
}

export const RecordEditor = withRecordEditor({ EditForm });

