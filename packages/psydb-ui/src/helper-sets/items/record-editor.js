import React from 'react';
import { merge, only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
    
    var translate = useUITranslation();

    var send = useSendPatch({
        collection,
        record,
        onSuccessfulUpdate,
        __noLastKnownEventId: true
    });

    var initialValues = merge(
        MainForm.createDefaults(),
        only({
            from: record.state,
            paths: [ 'label', 'displayNameI18N' ]
        })
    );

    return (
        <>
            <MainForm.Component
                title={ translate('Edit Helper Table Item') }
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

