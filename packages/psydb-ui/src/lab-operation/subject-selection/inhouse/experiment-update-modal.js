import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSend } from '@mpieva/psydb-ui-hooks';

import Pair from '@mpieva/psydb-ui-lib/src/pair';
import ExperimentIntervalSummary from '@mpieva/psydb-ui-lib/src/experiment-interval-summary';

const ExperimentUpdateModal = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData = {},

        subjectId,
        subjectLabel,
        
        onSuccessfulUpdate,
    } = ps;
 
    var {
        experimentRecord,
        locationRecord,
        slotDuration,
        start,
        studyId
    } = modalPayloadData;

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    var handleSubmit = useSend(() => ({
        type: 'experiment/add-subject',
        payload: {
            experimentId: experimentRecord._id,
            subjectId,
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ experimentRecord, subjectId ]
    });

    var body = null;
    if (show) {
        body = (
            <>
                <ExperimentIntervalSummary { ...({ experimentRecord })} />
                <hr />
                {/*<Pair label="Gewählter Proband">{ subjectLabel }</Pair>*/}
                <div style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                    <div className="mb-1">
                        Gewählter Proband
                    </div>
                    <div className="pl-3">
                        <b style={{ fontWeight: 600 }}>{ subjectLabel }</b>
                    </div>
                </div>
                <hr />
                <div>
                    <Button size="sm" onClick={ handleSubmit }>
                        Hinzufügen
                    </Button>
                </div>
            </>
        );
    }

    return (
        <Modal show={ show } onHide={ onHide } size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>Termin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { body }
            </Modal.Body>
        </Modal>
    );
}

export default ExperimentUpdateModal;
