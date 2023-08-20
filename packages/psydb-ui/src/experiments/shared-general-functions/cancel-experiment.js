import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { CancelExperimentModal } from '@mpieva/psydb-ui-lib/src/modals';

export const CancelExperimentContainer = (ps) => {
    var {
        experimentData,
        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
    var modal = useModalReducer();

    var { subjectData } = experimentData.record.state;
    var hasProcessedSubjects = !!subjectData.find(it => (
        it.participationStatus !== 'unknown'
    ));
    return (
        <>
            <Button 
                size='sm'
                variant='danger'
                className='mr-3'
                onClick={ modal.handleShow }
                disabled={ hasProcessedSubjects }
            >
                { translate('Cancel') }
            </Button>
            <CancelExperimentModal { ...({
                ...modal.passthrough,
                
                experimentType: experimentData.record.type,
                experimentId: experimentData.record._id,

                onSuccessfulUpdate,
            }) } />
        </>
    );
};
