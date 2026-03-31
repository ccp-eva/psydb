import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { PermissionDenied } from '@mpieva/psydb-ui-layout';

import ExtendedSearch from './extended-search';
import IntraRecordRouting from './intra-record-routing';

const RecordTypeRouting = (ps) => {
    var {
        collection, recordType,
        url, path, history,

        RecordList, RecordCreator,
        RecordDetails, RecordEditor, RecordRemover,
        RecordRawView, RecordRawHistory,
    } = ps;
    
    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    var sharedBag = { collection, recordType };
    var IntraRecordComponents = {
        RecordDetails, RecordEditor, RecordRemover,
        RecordRawView, RecordRawHistory,
    }

    return (
        <Switch>
            <Route exact path={ path }>
                <RecordList
                    { ...sharedBag }
                    linkBaseUrl={ url }
                    enableView={ false }
                    enableNew={ true }
                    enableEdit={ false }
                    enableExtendedSearch={ true }
                    enableCSVExport={ true }
                    enableRecordRowLink={ true }
                    canSort={ true }
                />
            </Route>
            
            <Route path={`${path}/extended-search/`}>
                <ExtendedSearch { ...sharedBag } />
            </Route>
            
            <Route exact path={`${path}/new`}>
                { canWrite ? (
                    <RecordCreator
                        { ...sharedBag }
                        onSuccessfulUpdate={
                            ({ id }) => history.push(`${url}/${id}`)
                        }
                    />
                ) : <PermissionDenied /> }
            </Route>

            <Route path={`${path}/:id`}>
                <IntraRecordRouting
                    { ...sharedBag }
                    { ...IntraRecordComponents }
                />
            </Route>

        </Switch>
    )
}

export default RecordTypeRouting;
