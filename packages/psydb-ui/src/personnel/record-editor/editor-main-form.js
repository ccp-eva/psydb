import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
    withRecordEditor
} from '@mpieva/psydb-ui-lib';

import MainForm from '../main-form';

export const EditorMainForm = (ps) => {
    var {
        collection,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var {
        record,
        schema,
        related
    } = fetched;

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
            'gdpr.emails',
            'gdpr.phones',
            'gdpr.description',
            'scientific.researchGroupSettings',
            'scientific.systemPermissions',
            ...(
                permissions.isRoot()
                ? [
                    'scientific.canLogIn',
                    'scientific.hasRootAccess',
                ]
                : []
            )
        ]
    })

    return (
        <MainForm.Component
            title='Mitarbeiter bearbeiten'
            initialValues={ initialValues }
            onSubmit={ send.exec }
            related={ related }
            permissions={ permissions }
        />
    );
}

