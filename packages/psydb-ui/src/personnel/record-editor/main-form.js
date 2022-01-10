import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox
} from '@mpieva/psydb-ui-lib';


import { useSendPatch } from './use-send-patch';
import { withRecordEditor } from './with-record-editor';

export const MainForm = (ps) => {
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

    var permissions = usePermissions();

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
            'scientific.researchGroupSettings',
            'scientific.systemPermissions',
            ...(
                permissions.isRoot()
                ? [
                    'scientific.hasRootAccess',
                ]
                : []
            )
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
                        <FormFields
                            related={ related }
                            permissions={ permissions }
                        />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    );
}

const FormFields = (ps) => {
    var { related, permissions } = ps;
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
            { permissions.isRoot() && (
                <>
                    <Fields.DefaultBool
                        label='MA hat Admin-Zugriff'
                        dataXPath='$.scientific.hasRootAccess'
                        required
                    />
                </>
            )}
        </>
    );
}
