import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from '../main-form';

const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    var permissions = usePermissions();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    return (
        <MainForm.Component
            title='Neuer Mitarbeiter:in'
            initialValues={ MainForm.createDefaults({ permissions }) }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
