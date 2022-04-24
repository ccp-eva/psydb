import React, { useState} from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { Button, LoadingIndicator, Alert } from '@mpieva/psydb-ui-layout';

import StudyTeamListItem from '@mpieva/psydb-ui-lib/src/experiment-operator-team-list-item';

import CreateModal from './create-modal';
import EditModal from './edit-modal';
import HideModal from './hide-modal';

import {
    useFetch,
    useModalReducer,
    useRevision,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

const StudyTeams = (ps) => {
    var { path, url } = useRouteMatch();
    var { id: studyId } = useParams();

    var revision = useRevision();

    var permissions = usePermissions();
    var canEdit = permissions.hasFlag('canWriteStudies');

    var createModal = useModalReducer();
    var editModal = useModalReducer();
    var hideModal = useModalReducer();

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
        <div className='pt-3'>
            <div className='d-flex justify-content-between mb-3'>
                { canEdit && (
                    <Button onClick={ createModal.handleShow }>
                        Neues Team
                    </Button>
                )}
                <Button
                    variant={ showHidden ? 'secondary' : 'outline-secondary'}
                    onClick={ () => setShowHidden(!showHidden) }
                >
                    Ausgeblendete anzeigen
                </Button>
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



            {
                records.length > 0
                ? (
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
                            enableDelete: record.state.hidden !== true,
                            onDeleteClick: hideModal.handleShow
                        })} />
                    ))
                )
                : <Fallback />
            }
        </div>
    )
}

var Fallback = (ps) => {
    return (
        <Alert variant='info'>Keine Teams vorhanden</Alert>
    )
}

export default StudyTeams;
