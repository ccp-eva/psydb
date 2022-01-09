import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { Button } from '@mpieva/psydb-ui-layout';

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

import only from './only-deep';
import { useSendPatch } from './use-send-patch';
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
        schema,
        //relatedRecordLabels,
        //relatedHelperSetItems,
        //relatedCustomRecordTypeLabels,
        ...related
    } = fetched.data;

    var setPasswordModal = useModalReducer();

    var send = useSendPatch({
        collection,
        record,
        subChannels: ['gdpr', 'scientific'],
        onSuccessfulUpdate
    });

    var initialValues = only({
        from: {
            gdpr: record.gdpr.state,
            scientific: record.scientific.state,
        },
        paths: [
            'gdpr.firstname',
            'gdpr.lastname',
            'gdpr.shorthand',
            'gdpr.emails',
            'gdpr.phones',
            'scientific.hasRootAccess',
            'scientific.researchGroupSettings',
            'scientific.systemPermissions',
        ]
    })

    return (
        <FormBox title='Mitarbeiter bearbeiten'>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ send.exec }
                useAjvAsync
            >
                {(formikProps) => (
                    <>
                        <FormFields related={ related } />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { related } = ps;
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

            <Fields.DefaultBool
                label='Admin-Zugriff'
                dataXPath='$.scientific.hasRootAccess'
                required
            />
            <Fields.ResearchGroupWithRoleList
                label='Forschungsgruppen'
                dataXPath='$.scientific.researchGroupSettings'
                related={ related }
                required
            />
            <Fields.AccessRightByResearchGroupList
                label='Zugriff auf diesen Datensatz für'
                dataXPath='$.scientific.systemPermissions.accessRightsByResearchGroup'
                related={ related }
                required
            />
        </>
    );
}

export const RecordEditor = withRecordEditor({ EditForm });

