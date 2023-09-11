import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSendCreate } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var { collection, setId, onSuccessfulUpdate } = ps;
    var translate = useUITranslation();
    
    var send = useSendCreate({
        collection,
        additionalPayloadProps: { setId },
        onSuccessfulUpdate
    })

    return (
        <MainForm.Component
            title={ translate('New Helper Table Item') }
            initialValues={ MainForm.createDefaults() }
            onSubmit={ send.exec }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
