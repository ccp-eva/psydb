import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSendCreate, usePermissions }
    from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var { collection, recordType, onSuccessfulUpdate } = ps;

    var [{ translate }] = useI18N();
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection, recordType
        })
    ), [ collection, recordType ])

    var send = useSendCreate({
        collection,
        recordType,
        onSuccessfulUpdate
    })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { fieldDefinitions } = fetched.data;
    var initialValues = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });

    return (
        <MainForm.Component
            title={ translate('New External Person') }
            fieldDefinitions={ fieldDefinitions }
            initialValues={ initialValues }
            permissions={ permissions }
            { ...send.passthrough }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

