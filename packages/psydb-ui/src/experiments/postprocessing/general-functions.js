import React, { useState, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    Button
} from 'react-bootstrap';

import {
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
    
    var history = useHistory();
    var { url } = useRouteMatch();

    var permissions = usePermissions();
    var canMove = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    var canCancel = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );

    return (
        <>
            { canMove && experimentType === 'away-team' && (
                <FollowUpExperimentContainer { ...({
                    experimentData,
                    opsTeamData,
                    studyData,
                    onSuccessfulUpdate: (response) => {
                        var { data } = response.data;
                        var { channelId: nextId } = data.find(it => (
                            it.collection === 'experiment' && it.isNew
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

const FollowUpExperimentContainer = ({
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
                Folgetermin
            </Button>
            <FollowUpExperimentModal { ...({
                show,
                onHide: handleHide,
                
                experimentType: experimentData.record.type,
                experimentData,
                teamData: opsTeamData,
                studyData,
                onSuccessfulUpdate,
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
