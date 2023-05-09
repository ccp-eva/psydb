import React from 'react';

import {
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

import { LinkContainer } from '@mpieva/psydb-ui-layout';
import ExtendedSearch from './extended-search';
import IntraRecordRouting from './intra-record-routing';

const RecordTypeRouting = ({
    collection,
    recordType,

    url,
    path,
    history,

    RecordList,
    RecordDetails,
    RecordCreator,
    RecordEditor,
    RecordRemover,
}) => (
    <Switch>
        <Route exact path={`${path}`}>
            <>
                <RecordList
                    linkBaseUrl={ url }
                    collection={ collection }
                    recordType={ recordType }
                    enableView={ false }
                    enableCSVExport={ true }
                    enableExtendedSearch={ true }
                    enableNew={ true }
                    enableEdit={ false }
                    enableRecordRowLink={ true }
                    canSort={ true }
                />
            </>
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

        <Route path={`${path}/extended-search/`}>
            <ExtendedSearch {...({
                collection,
                recordType
            })} />
        </Route>

        <Route path={`${path}/:id`}>
            <IntraRecordRouting { ...({
                collection,
                recordType,

                RecordDetails,
                RecordCreator,
                RecordEditor,
                RecordRemover,
            }) } />
        </Route>
    </Switch>
);

export default RecordTypeRouting;
