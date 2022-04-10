import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkContainer, PermissionDenied } from '@mpieva/psydb-ui-layout';

import FormBox from '@mpieva/psydb-ui-lib/src/form-box';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';
import StudyRecordDetails from './record-details';
import StudyRecordContainer from './record-container';
import StudyRecordForm from './record-form';
import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';

const StudyRecordTypeView = ({
    customRecordTypes,
    collection,
}) => {
    var { path, url } = useRouteMatch();
    var { recordType } = useParams();
    var history= useHistory();
    var permissions = usePermissions();

    var canRead = permissions.hasFlag('canReadStudies');
    var canWrite = permissions.hasFlag('canWriteStudies');

    if (!canRead) {
        return <PermissionDenied />
    }

    var typeData = undefined;
    if (recordType) {
        typeData = customRecordTypes.find(it => it.type === recordType);
    }

    return (
        <div>
            { recordType && (
                <LinkContainer to={ url }>
                    <h5 className='mt-0 mb-3 text-muted' role='button'>
                        Typ: { typeData.label }
                    </h5>
                </LinkContainer>
            )}
            <Switch>
                <Route exact path={`${path}`}>
                    <RecordListContainer
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
                                <StudyRecordForm
                                    type='create'
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

                {/*<Route path={`${path}/:id/edit`}>
                    <GenericRecordForm
                        type='edit'
                        collection={ collection }
                        recordType={ recordType }
                        onUpdated={ ({ id }) => {
                            //history.push(`${url}`)
                        }}
                    />
                </Route>*/}
            </Switch>
        </div>
    );
}

export default StudyRecordTypeView;
