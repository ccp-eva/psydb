import React, { useState, useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    Button
} from 'react-bootstrap';

import {
    FollowUpExperimentModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const GeneralFunctions = ({
    experimentData,
    opsTeamData,
    studyData,
    onSuccessfulUpdate,
}) => {
    var { type: experimentType } = experimentData.record;
    
    var permissions = usePermissions();
    var canMove = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    
    return (
        <>
            { canMove && experimentType === 'away-team' && (
                <FollowUpExperimentContainer { ...({
                    experimentData,
                    opsTeamData,
                    studyData,
                    onSuccessfulUpdate,
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
export default GeneralFunctions;
