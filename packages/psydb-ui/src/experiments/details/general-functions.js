import React, { useState, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    Button
} from 'react-bootstrap';

import {
    ChangeTeamModal,
    MoveExperimentModal,
    FollowUpExperimentModal,
    CancelExperimentModal
} from '@mpieva/psydb-ui-lib/src/modals';

const GeneralFunctions = ({
    experimentData,
    opsTeamData,
    studyData,
    onSuccessfulUpdate,
}) => {
    var { type: experimentType } = experimentData.record;
    
    var permissions = usePermissions();
    var canChangeOpsTeam = permissions.hasLabOperationFlag(
        experimentType, 'canChangeOpsTeam'
    );
    var canMove = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    var canCancel = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    
    return (
        <>
            { canChangeOpsTeam && (
                <ChangeTeamContainer { ...({
                    experimentType,
                    experimentId: experimentData.record._id,
                    studyId: studyData.record._id,
                    currentTeamId: (
                        experimentData.record.state.opsTeamId
                    ),
                    onSuccessfulUpdate,
                }) } />
            )}
            
            { canMove && (
                <MoveExperimentContainer { ...({
                    experimentData,
                    opsTeamData,
                    studyData,
                    onSuccessfulUpdate,
                }) } />
            )}

            { canMove && experimentType === 'away-team' && (
                <FollowUpExperimentContainer { ...({
                    experimentData,
                    opsTeamData,
                    studyData,
                    onSuccessfulUpdate,
                }) } />
            )}
            
            { canCancel && experimentType === 'away-team' && (
                <CancelExperimentContainer { ...({
                    experimentData,
                    onSuccessfulUpdate: () => {
                        history.replace(`${up(url, 1)}/remove-success`);
                    },
                }) } />
            )}
        </>
    );
}

const ChangeTeamContainer = ({
    experimentId,
    studyId,
    currentTeamId,
    onSuccessfulUpdate,
}) => {
    var [ show, setShow ] = useState(false);
    var handleShow = useCallback(() => setShow(true), []);
    var handleHide = useCallback(() => setShow(false), []);
    return (
        <>
            <Button size='sm' className='mr-3' onClick={ handleShow }>
                Team ändern
            </Button>
            <ChangeTeamModal { ...({
                show,
                onHide: handleHide,

                experimentId,
                studyId,
                currentTeamId,
                onSuccessfulUpdate
            }) } />
        </>
    );
};

const MoveExperimentContainer = ({
    experimentData,
    opsTeamData,
    studyData,
    onSuccessfulUpdate,
}) => {
    var [ show, setShow ] = useState(false);
    var handleShow = useCallback(() => setShow(true), []);
    var handleHide = useCallback(() => setShow(false), []);
    return (
        <>
            <Button size='sm' className='mr-3' onClick={ handleShow }>
                Verschieben
            </Button>
            <MoveExperimentModal { ...({
                show,
                onHide: handleHide,
                
                experimentType: experimentData.record.type,
                experimentData,
                teamData: opsTeamData,
                studyData,
                onSuccessfulUpdate
            }) } />
        </>
    );
};

const FollowUpExperimentContainer = ({
    experimentData,
    opsTeamData,
    studyData,
    onSuccessfulUpdate,
}) => {
    var { url } = useRouteMatch();
    var history = useHistory();

    var [ show, setShow ] = useState(false);
    var handleShow = useCallback(() => setShow(true), []);
    var handleHide = useCallback(() => setShow(false), []);
    return (
        <>
            <Button size='sm' className='mr-3' onClick={ handleShow }>
                Folgetermin
            </Button>
            <FollowUpExperimentModal { ...({
                show,
                onHide: handleHide,
                
                experimentType: experimentData.record.type,
                experimentData,
                teamData: opsTeamData,
                studyData,
                onSuccessfulUpdate: (response) => {
                    var { data } = response.data;
                    var { channelId: nextId } = data.find(it => (
                        it.collection === 'experiment' && it.isNew
                    ));

                    history.push(`${up(url, 1)}/${nextId}`);
                }
            }) } />
        </>
    );
};

const CancelExperimentContainer = ({
    experimentData,
    onSuccessfulUpdate,
}) => {
    var { subjectData } = experimentData.record.state;
    var hasProcessedSubjects = !!subjectData.find(it => (
        it.participationId !== 'unknown'
    ));
    
    var [ show, setShow ] = useState(false);
    var handleShow = useCallback(() => setShow(true), []);
    var handleHide = useCallback(() => setShow(false), []);
    return (
        <>
            <Button 
                size='sm'
                variant='danger'
                className='mr-3'
                onClick={ handleShow }
                disabled={ hasProcessedSubjects }
            >
                Absagen
            </Button>
            <CancelExperimentModal { ...({
                show,
                onHide: handleHide,
                
                experimentType: experimentData.record.type,
                experimentId: experimentData.record._id,

                onSuccessfulUpdate,
            }) } />
        </>
    );
};
export default GeneralFunctions;
