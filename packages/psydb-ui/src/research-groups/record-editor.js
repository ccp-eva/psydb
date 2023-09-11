import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();
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
                title={ translate('Edit Research Group') }
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
    shouldFetchCRTSettings: false
});

