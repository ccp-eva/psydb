import React, { useState, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    ChangeTeamModal,
    MoveExperimentModal,
    CancelExperimentModal
} from '@mpieva/psydb-ui-lib/src/modals';

import { Button } from '@mpieva/psydb-ui-layout';
import {
    SelectSubjectContainer,
    ChangeExperimentStudyContainer,
    FollowUpExperimentContainer,
    CancelExperimentContainer
} from '../shared-general-functions';


const GeneralFunctions = ({
    experimentData,
    opsTeamData,
    studyData,
    onSuccessfulUpdate,
}) => {
    var { type: experimentType } = experimentData.record;
    
    var permissions = usePermissions();
    var canSelectSubjects = permissions.hasLabOperationFlag(
        experimentType, 'canSelectSubjectsForExperiments'
    );
    var canChangeStudy = permissions.hasLabOperationFlag(
        experimentType, 'canChangeExperimentStudy'
    );
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
            {/* canSelectSubjects && (
                <SelectSubjectContainer { ...({
                    experimentRecord: experimentData.record,
                    onSuccessfulUpdate,
                }) } />
            )*/}
            { canChangeStudy && (
                <ChangeExperimentStudyContainer { ...({
                    experimentData,
                    opsTeamData,
                    onSuccessfulUpdate,
                }) } />
            )}
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
    experimentType,
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

                experimentType,
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
