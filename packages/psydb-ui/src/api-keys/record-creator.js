import React from 'react';
import {
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

import { URL } from '@mpieva/psydb-ui-utils';
import { useSendCreate } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var {
        collection,
        // onSuccessfulUpdate,
    } = ps;
        
    var history = useHistory();
    var { url } = useRouteMatch();
    
    var send = useSendCreate({
        collection,
        onSuccessfulUpdate: () => history.push(URL.up(url, 1))
    })

    return (
        <MainForm.Component
            title='Neuer ApiKey'
            initialValues={ MainForm.createDefaults() }
            onSubmit={ send.exec }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
