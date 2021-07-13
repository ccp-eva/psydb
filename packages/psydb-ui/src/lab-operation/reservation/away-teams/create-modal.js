import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import useSend from '@mpieva/psydb-ui-lib/src/use-send';
import Pair from '@mpieva/psydb-ui-lib/src/pair';

const CreateModal = ({
    show,
    onHide,
    modalPayloadData,
    studyId,

    onSuccessfulUpdate
}) => {
    var { teamRecord, interval } = modalPayloadData;

    var wrappedOnSuccessfulUpdate = (...args) => {
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
        onHide();
    }

    var handleSubmit = useSend(() => ({
        type: 'reservation/reserve-awayteam-slot',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId: teamRecord._id,
                interval
            }
        }
    }), { onSuccessfulUpdate: wrappedOnSuccessfulUpdate });

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Zeit reservieren</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <Pair label='Team'>
                    <span className='d-inline-block mr-2' style={{
                        backgroundColor: teamRecord.state.color,
                        height: '24px',
                        width: '24px',
                        verticalAlign: 'bottom',
                    }} />
                    { teamRecord.state.name }
                </Pair>
                <Pair label='Datum'>
                    { datefns.format(interval.start, 'cccc P')}
                </Pair>
                <hr />
                <div className='d-flex justify-content-end'>
                    <Button onClick={ handleSubmit }>
                        Reservieren
                    </Button>
                </div>
            </Modal.Body>
            
        </Modal>

    );
}

const WrappedCreateModal = (ps) => {
    if (!ps.modalPayloadData) {
        return null;
    }
    return <CreateModal { ...ps } />
}

export default WrappedCreateModal;
