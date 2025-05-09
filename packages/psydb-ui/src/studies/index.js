import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkContainer, PermissionDenied } from '@mpieva/psydb-ui-layout';
import { FormBox } from '@mpieva/psydb-ui-lib';

import StudyRecordContainer from './record-container';
import RecordCreator from './record-creator';
import { RecordRemover } from './record-remover';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import ExtendedSearch from './extended-search';



const StudyRouting = (ps) => {
    var {
        collection,
        recordType,

        url,
        path,
        history,

        RecordList,
    } = ps;

    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    return (
        <Switch>
            <Route exact path={ path }>
                <RecordList
                    linkBaseUrl={ url }
                    collection={ collection }
                    recordType={ recordType }
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
                <ExtendedSearch {...({
                    collection,
                    recordType
                })} />
            </Route>
            
            <Route exact path={`${path}/new`}>
                { canWrite
                    ? (
                        <RecordCreator
                            collection='study'
                            recordType={ recordType }
                            onSuccessfulUpdate={
                                // FIXME: depends on if subject
                                // selection is available
                                ({ id }) => history.push(`${url}/${id}`)
                                //({ id }) => history.push(`${url}/${id}/selection-settings`)
                            }
                        />
                    )
                    : <PermissionDenied />
                }
            </Route>
            <Route path={`${path}/:id/remove`}>
                <RecordRemover
                    collection={ collection }
                    recordType={ recordType }
                    successInfoBackLink={ `#${url}` }
                    onSuccessfulUpdate={ ({ id }) => {
                        history.push(`${url}/${id}/remove/success`)
                    }}
                />
            </Route>
            <Route path={`${path}/:id`}>
                <StudyRecordContainer
                    collection={ collection }
                    recordType={ recordType }
                />
            </Route>
        </Switch>
    )
}

const StudyTypeView = withRecordTypeView({
    CustomRouting: StudyRouting
});

const Studies = withCollectionView({
    collection: 'study',
    RecordTypeView: StudyTypeView
});

export default Studies;
