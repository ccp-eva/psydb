import React from 'react';
import HelperSetItems from './helper-set-items';

import {
    Route,
    Switch,
} from 'react-router-dom';

const HelperSetRouting = (ps) => {
    var {
        collection,
        recordType,
        
        path,
        url,
        history,

        RecordList,
        RecordDetails,
        RecordCreator,
        RecordEditor,
        RecordRemover,
    } = ps;
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

            <Route path={ `${path}/:setId/remove` }>
                <RecordRemover
                    collection='helperSet'
                    successInfoBackLink={ `#${url}` }
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}/${id}/remove/success`)
                    }}
                />
            </Route>
            
        </Switch>
    )
}

export default HelperSetRouting;
