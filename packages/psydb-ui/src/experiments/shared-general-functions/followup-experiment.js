import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { FollowUpExperimentModal } from '@mpieva/psydb-ui-lib/src/modals';

export const FollowUpExperimentContainer = (ps) => {
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
                { translate('Follow-Up Appointment') }
            </Button>
            <FollowUpExperimentModal { ...({
                ...modal.passthrough,
                
                experimentType: experimentData.record.type,
                experimentData,
                teamData: opsTeamData,
                studyData,
                onSuccessfulUpdate,
            }) } />
        </>
    );
};
