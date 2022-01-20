import React from 'react';

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
        ...related
    } = fetched.data;

    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        record,
        onSuccessfulUpdate
    });

    var initialValues = record.state;

    return (
        <>
            <MainForm
                title='System-Rolle bearbeiten'
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
            />
        </>
    )
}

export const RecordEditor = withRecordEditor({ EditForm });

