import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import { MainForm } from './main-form';


const Defaults = () => ({
    name: '',
    shorthand: '',
    address: {},
    description: '',
});

const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    var initialValues = Defaults();

    return (
        <MainForm
            title={ translate('New Research Group')}
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

