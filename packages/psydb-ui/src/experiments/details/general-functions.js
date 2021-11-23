import React, { useState, useCallback } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Button
} from 'react-bootstrap';

import {
    ChangeTeamModal,
    MoveExperimentModal
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
    
    return (
        <>
            { canChangeOpsTeam && (
                <ChangeTeamContainer { ...({
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

export default GeneralFunctions;
