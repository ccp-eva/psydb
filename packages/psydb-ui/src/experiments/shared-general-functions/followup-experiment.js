import React, { useState, useCallback } from 'react';
import { Button } from '@mpieva/psydb-ui-layout';
import { FollowUpExperimentModal } from '@mpieva/psydb-ui-lib/src/modals';

export const FollowUpExperimentContainer = ({
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
