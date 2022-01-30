import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var {
        record,
        fieldDefinitions,
        related
    } = fetched;

    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });

    var initialValues = only({
        from: record.state,
        paths: [
            'custom',
            'systemPermissions',
        ]
    });

    return (
        <>
            <MainForm.Component
                title='Externe Organisation bearbeiten'
                fieldDefinitions={ fieldDefinitions }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
            />
        </>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

