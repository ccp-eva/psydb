import React, { useState } from 'react';
import { useRouteMatch, useParams } from 'react-router';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useModalReducer, useRevision, usePermissions }
    from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Icons, Button, Alert }
    from '@mpieva/psydb-ui-layout';

import StudyTeamListItem from '@mpieva/psydb-ui-lib/src/experiment-operator-team-list-item';

import CreateModal from './create-modal';
import EditModal from './edit-modal';
import HideModal from './hide-modal';


const StudyTeams = (ps) => {
    var { path, url } = useRouteMatch();
    var { id: studyId } = useParams();

    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    var canEdit = permissions.hasFlag('canWriteStudies');

    var revision = useRevision();
    var [ createModal, editModal, hideModal ] = useModalReducer.many(3);

    var [ showHidden, setShowHidden ] = useState();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        })
    ), [ studyId, revision.value ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, ...related } = fetched.data;
    
    return (
        <div className=''>
            <div className='d-flex justify-content-between mb-3'>
                { canEdit && (
                    <Button size='sm' onClick={ createModal.handleShow }>
                        { '+ ' + translate('New Team') }
                    </Button>
                )}
                <div
                    role='button'
                    className='d-flex align-items-center text-primary'
                    onClick={ () => setShowHidden(!showHidden) }
                >
                    {
                        showHidden 
                        ? <Icons.CheckSquareFill />
                        : <Icons.Square />
                    }
                    <span className='ml-2'>
                        { translate('Show Hidden') }
                    </span>
                </div>
            </div>

            <CreateModal
                { ...createModal.passthrough }
                onSuccessfulUpdate={ revision.up }
                studyId={ studyId }
            />

            <EditModal
                { ...editModal.passthrough }
                onSuccessfulUpdate={ revision.up }
                studyId={ studyId }
            />

            <HideModal
                { ...hideModal.passthrough }
                onSuccessfulUpdate={ revision.up }
                studyId={ studyId }
            />

            { records.length > 0 ? (
                records
                .filter(it => showHidden || it.state.hidden !== true)
                .map(record => (
                    <StudyTeamListItem {...({
                        key: record._id,
                        studyId,
                        record,
                        ...related,
                        canEdit,
                        onEditClick: editModal.handleShow,
                        enableDelete: canEdit && record.state.hidden !== true,
                        onDeleteClick: hideModal.handleShow
                    })} />
                ))
            ) : <Fallback /> }
        </div>
    )
}

var Fallback = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <Alert variant='info'>
            <i>{ translate('No teams in this study.') }</i>
        </Alert>
    )
}

export default StudyTeams;
