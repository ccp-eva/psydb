import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useSend } from '@mpieva/psydb-ui-hooks';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import { Pair } from '@mpieva/psydb-ui-layout';

const DeleteModal = ({
    show,
    onHide,
    modalPayloadData,
    studyId,

    onSuccessfulUpdate
}) => {
    var { teamRecord, interval, reservationRecord } = modalPayloadData;

    var send = useSend(() => ({
        type: 'reservation/remove-awayteam-slot',
        payload: {
            props: {
                id: reservationRecord._id
            }
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Löschen</Modal.Title>
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
                    <Button variant='danger' size='sm' onClick={ send.exec }>
                        Löschen
                    </Button>
                </div>
            </Modal.Body>
            
        </Modal>

    );
}

const WrappedDeleteModal = (ps) => {
    if (!ps.modalPayloadData) {
        return null;
    }
    return <DeleteModal { ...ps } />
}

export default WrappedDeleteModal;
