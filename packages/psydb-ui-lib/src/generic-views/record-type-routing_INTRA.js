import React from 'react';

import {
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

const RecordTypeRouting_INTRA = (ps) => {
    var {
        collection, recordType,
        url, path, history,

        RecordList, RecordCreator, IntraRecordRouting,
        RecordDetails, RecordEditor, RecordRemover
    } = ps;

    return <Switch>
         <Route exact path={`${path}`}>
            <RecordList
                linkBaseUrl={ url }
                collection={ collection }
                recordType={ recordType }
                enableView={ false }
                enableNew={ true }
                enableEdit={ false }
                enableRecordRowLink={ true }
                canSort={ true }
            />
        </Route>

        <Route exact path={`${path}/new`}>
            <RecordCreator
                type='create'
                collection={ collection }
                recordType={ recordType }
                onSuccessfulUpdate={
                    ({ id }) => history.push(`${url}/${id}`)
                }
            />
        </Route>

        <Route path={`${path}/:id`}>
            <IntraRecordRouting
                collection={ collection }
                recordType={ recordType }

                RecordDetails={ RecordDetails }
                RecordEditor={ RecordEditor }
                RecordRemover={ RecordRemover }
            />
        </Route>
    </Switch>
};

export default RecordTypeRouting_INTRA;
