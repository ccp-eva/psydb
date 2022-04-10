import React from 'react';

import {
    useFetch,
    useSendCreate,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';


const CreateForm = (ps) => {
    var { collection, recordType, onSuccessfulUpdate } = ps;
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

    var renderedContent = (
        <>
            <MainForm.Component
                title='Neue Studie'
                crtSettings={ fetched.data }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                permissions={ permissions }
            />
        </>
    );

    return (
        <div className='mt-3'>
            { renderedContent }
        </div>
    );
}

const RecordCreator = withRecordCreator({
    CreateForm,
});

export default RecordCreator;
