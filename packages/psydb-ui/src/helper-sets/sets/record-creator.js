import React from 'react';

import { useSendCreate } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    
    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    return (
        <MainForm.Component
            title='Neue Hilfstabelle'
            initialValues={ MainForm.createDefaults() }
            onSubmit={ send.exec }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
