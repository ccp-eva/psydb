import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useFetch,
    useSendCreate,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, FormBox } from '@mpieva/psydb-ui-layout';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var { collection, recordType, onSuccessfulUpdate } = ps;

    var translate = useUITranslation();
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

    var { reservationType, fieldDefinitions } = fetched.data;
    var initialValues = MainForm.createDefaults({
        reservationType,
        fieldDefinitions,
        permissions
    });

    return (
        <FormBox title={ translate('New Location') }>
            <MainForm.Component
                reservationType={ reservationType }
                fieldDefinitions={ fieldDefinitions }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                permissions={ permissions }
            />
        </FormBox>
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

