import React from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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


const GeneralFunctions = (ps) => {
    var {
        experimentData,
        opsTeamData,
        studyData,
        onSuccessfulUpdate,
    } = ps;
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


const ChangeTeamContainer = (ps) => {
    var {
        experimentType,
        experimentId,
        studyId,
        currentTeamId,
        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
    var modal = useModalReducer();

    return (
        <>
            <Button size='sm' className='mr-3' onClick={ modal.handleShow }>
                { translate('Change Team') }
            </Button>
            <ChangeTeamModal { ...({
                ...modal.passthrough,

                experimentType,
                experimentId,
                studyId,
                currentTeamId,
                onSuccessfulUpdate
            }) } />
        </>
    );
};

const MoveExperimentContainer = (ps) => {
    var {
        experimentData,
        opsTeamData,
        studyData,
        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
    var modal = useModalReducer();

    return (
        <>
            <Button size='sm' className='mr-3' onClick={ modal.handleShow }>
                { translate('Reschedule') }
            </Button>
            <MoveExperimentModal { ...({
                ...modal.passthrough,
                
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
