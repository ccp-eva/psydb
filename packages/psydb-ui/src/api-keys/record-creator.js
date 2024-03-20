import React from 'react';
import {
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

import { URL } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSendCreate } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var {
        collection,
        // onSuccessfulUpdate,
    } = ps;
        
    var translate = useUITranslation();
    var history = useHistory();
    var { url } = useRouteMatch();
    
    var send = useSendCreate({
        collection,
        onSuccessfulUpdate: () => history.push(URL.up(url, 1))
    })

    return (
        <MainForm.Component
            type='create'
            title={ translate('New API Key') }
            initialValues={ MainForm.createDefaults() }
            onSubmit={ send.exec }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
