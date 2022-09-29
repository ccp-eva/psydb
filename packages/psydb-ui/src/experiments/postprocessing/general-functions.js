import React, { useState, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
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
    var {
        _id: experimentId,
        type: experimentType,
    } = experimentData.record;
    
    var history = useHistory();
    var { url } = useRouteMatch();

    var permissions = usePermissions();
    var canChangeStudy = permissions.hasLabOperationFlag(
        experimentType, 'canChangeExperimentStudy'
    );
    var canMove = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    var canCancel = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );

    return (
        <>
            { canChangeStudy && (
                <ChangeExperimentStudyContainer { ...({
                    experimentData,
                    opsTeamData,
                    onSuccessfulUpdate,
                }) } />
            )}
            { canMove && experimentType === 'away-team' && (
                <FollowUpExperimentContainer { ...({
                    experimentData,
                    opsTeamData,
                    studyData,
                    onSuccessfulUpdate: (response) => {
                        var { data } = response.data;
                        var { channelId: nextId } = data.find(it => (
                            it.collection === 'experiment' &&
                            it.channelId !== experimentId
                        ));

                        history.push(`${up(url, 1)}/${nextId}`);
                    }
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


export default GeneralFunctions;
