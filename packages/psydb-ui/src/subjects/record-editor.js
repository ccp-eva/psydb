import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import { MainForm } from './main-form';

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
            'gdpr.custom',
            'scientific.custom',
            'scientific.systemPermissions',
        ]
    });

    return (
        <>
            <MainForm
                title='Proband bearbeiten'
                schema={ schema }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
            />
        </>
    )
}

export const RecordEditor = withRecordEditor({ EditForm });

