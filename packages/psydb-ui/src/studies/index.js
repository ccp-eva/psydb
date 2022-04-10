import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { FormBox } from '@mpieva/psydb-ui-lib';

import StudyRecordContainer from './record-container';
import RecordCreator from './record-creator';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'


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
                    enableView={ true }
                    enableNew={ true }
                    enableEdit={ true }
                />
            </Route>
            <Route exact path={`${path}/new`}>
                { canWrite
                    ? (
                        <FormBox title='Neuer Datensatz'>
                            <RecordCreator
                                collection='study'
                                recordType={ recordType }
                                onSuccessfulUpdate={
                                    ({ id }) => history.push(`${url}/${id}/selection-settings`)
                                }
                            />
                        </FormBox>
                    )
                    : <PermissionDenied />
                }
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
