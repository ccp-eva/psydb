import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const EditForm = (ps) => {
    var {
        collection,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record } = fetched;

    var send = useSendPatch({
        collection,
        record,
        onSuccessfulUpdate
    });

    var initialValues = only({
        from: record.state,
        paths: [ 'label', 'isEnabled', 'permissions' ]
    });

    return (
        <>
            <MainForm.Component
                title='Api-Key bearbeiten'
                initialValues={ initialValues }
                onSubmit={ send.exec }
            />
        </>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
    shouldFetchCRTSettings: false,
});

