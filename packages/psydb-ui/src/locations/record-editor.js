import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { withRecordEditor, FormBox } from '@mpieva/psydb-ui-lib';
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
        crtSettings,
        record,
        related
    } = fetched;

    var {
        reservationType,
        fieldDefinitions
    } = crtSettings;

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
            'comment',
            'reservationSettings',
            'systemPermissions',
        ]
    });

    var isHidden = record.state.systemPermissions.isHidden;

    return (
        <FormBox title='Location bearbeiten' isRecordHidden={ isHidden }>
            <MainForm.Component
                reservationType={ reservationType }
                fieldDefinitions={ fieldDefinitions }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
            />
        </FormBox>
    )
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

