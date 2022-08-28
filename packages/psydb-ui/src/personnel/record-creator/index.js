import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { FormBox } from '@mpieva/psydb-ui-layout';
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
        <FormBox title='Neue Mitarbeiter:in'>
            <MainForm.Component
                initialValues={ MainForm.createDefaults({ permissions }) }
                onSubmit={ send.exec }
                permissions={ permissions }
            />
        </FormBox>
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
