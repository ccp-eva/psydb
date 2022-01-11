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

import { MainForm } from '../main-form';

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
        <MainForm
            title='Mitarbeiter bearbeiten'
            initialValues={ initialValues }
            onSubmit={ send.exec }
            related={ related }
            permissions={ permissions }
        />
    );
}

