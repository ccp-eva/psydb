import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
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

    var { crtSettings, record, related } = fetched;
    var { fieldDefinitions } = crtSettings;

    var [{ translate }] = useI18N();
    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });

    var initialValues = only({
        from: record.state,
        paths: [ 'custom', 'systemPermissions' ]
    });

    return (
        <>
            <MainForm.Component
                title={ translate('Edit External Person') }
                fieldDefinitions={ fieldDefinitions }
                initialValues={ initialValues }
                related={ related }
                permissions={ permissions }
                { ...send.passthrough }
            />
        </>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

