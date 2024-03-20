import React from 'react';
import {
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

import { URL } from '@mpieva/psydb-ui-utils';
import { useSelf, useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var {
        collection,
        // onSuccessfulUpdate,
    } = ps;
        
    var history = useHistory();
    var { url } = useRouteMatch();
    var translate = useUITranslation();
    var self = useSelf();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate: () => history.push(URL.up(url, 1)),
        autoPayload: false,
    })

    return (
        <MainForm.Component
            type='create'
            title={ translate('New API Key') }
            initialValues={ MainForm.createDefaults({
                personnelId: self.record._id
            }) }
            onSubmit={ send.exec }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
