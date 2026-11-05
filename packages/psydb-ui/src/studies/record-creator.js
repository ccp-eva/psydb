import React from 'react';

import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions, useSend } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';


const CreateForm = (ps) => {
    var { collection, recordType, onSuccessfulUpdate } = ps;
    
    var { dev_enableStudyRoadmap } = useUIConfig();
    var permissions = usePermissions();
    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection, recordType
        })
    ), [ collection, recordType ])

    var send = useSend((formData) => {
        var { studyRoadmap, ...props } = formData;
        return { type: 'study/create', payload: {
            type: recordType,
            props,

            ...(dev_enableStudyRoadmap && {
                studyRoadmap
            })
        }}
    }, { onSuccessfulUpdate: (response) => {
        var [{ channelId }] = response.data.data;
        onSuccessfulUpdate?.({ id: channelId, response })
    }});

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
                title={ translate('New Study') }
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

export const RecordCreator = withRecordCreator({
    CreateForm,
});

