import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { FormBox } from '@mpieva/psydb-ui-layout';
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

    var isHidden = record.state.systemPermissions.isHidden;

    return (
        <FormBox
            title={ translate('Edit External Organization') }
            isRecordHidden={ isHidden }
        >
            <MainForm.Component
                fieldDefinitions={ fieldDefinitions }
                initialValues={ initialValues }
                related={ related }
                permissions={ permissions }
                { ...send.passthrough }
            />
        </FormBox>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

