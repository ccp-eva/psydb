import React, { useState, useCallback } from 'react';
import { Button } from '@mpieva/psydb-ui-layout';
import { CancelExperimentModal } from '@mpieva/psydb-ui-lib/src/modals';

export const CancelExperimentContainer = ({
    experimentData,
    onSuccessfulUpdate,
}) => {
    var { subjectData } = experimentData.record.state;
    var hasProcessedSubjects = !!subjectData.find(it => (
        it.participationStatus !== 'unknown'
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
