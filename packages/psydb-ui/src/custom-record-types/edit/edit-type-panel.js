import React, { useState, useEffect, useReducer, useCallback } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { TabNav } from '@mpieva/psydb-ui-layout';

import LiveDataEditor from '../live-data-editor';
import FieldEditor from '../field-editor';

const EditTypePanel = ({
    id,
    record,
    onSuccessfulUpdate
}) => {
    var { path, url } = useRouteMatch();
    var { tabKey } = useParams();
    var history = useHistory();
    
    var content = (
        tabKey === 'fields'
        ? (
            <FieldEditor
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        )
        : (
            <LiveDataEditor
                record={ record }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        )
    )

    return (
        <div>
            <TabNav
                className='d-flex'
                itemClassName='flex-grow'
                activeKey={ tabKey }
                onItemClick={ (key) => {
                    history.push(`${up(url, 1)}/${key}`);
                }}
                items={[
                    { key: 'live', label: 'Live-Settings' },
                    { key: 'fields', label: 'Feld-Editor' },
                ]}
            />
            
            <div className='p-3 border-left border-bottom border-right'>
                { content }
            </div>

        </div>
    )
}

export default EditTypePanel;
