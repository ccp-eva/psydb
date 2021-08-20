import React from 'react';
import HelperSetItems from './helper-set-items';

import {
    Route,
    Switch,
} from 'react-router-dom';

const HelperSetRouting = ({
    collection,
    recordType,
    
    path,
    url,
    history,

    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor,
}) => {
    return (
        <Switch>
            
            <Route exact path={`${path}`}>
                <RecordList
                    linkBaseUrl={ url }
                    collection={ collection }
                    enableNew={ true }
                />
            </Route>

            <Route path={`${path}/new`}>
                <RecordCreator
                    type='create'
                    collection={ collection }
                    recordType={ recordType }
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}`)
                    }}
                />
            </Route>

            <Route path={`${path}/:id/edit`}>
                <RecordEditor
                    type='edit'
                    collection={ collection }
                    recordType={ recordType }
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}`)
                    }}
                />
            </Route>

            <Route path={ `${path}/:setId/items` }>
                <HelperSetItems />
            </Route>
            
        </Switch>
    )
}

export default HelperSetRouting;
