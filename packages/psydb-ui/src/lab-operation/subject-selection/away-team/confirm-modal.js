import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

import { createSend, demuxed } from '@mpieva/psydb-ui-utils';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';
import { Pair } from '@mpieva/psydb-ui-layout';

const ConfirmModal = ({
    show,
    onHide,
    modalPayloadData,
    studyId,
    locationRecord,
    selectedSubjectRecords,

    onSuccessfulUpdate
}) => {
    var { teamRecord, interval } = modalPayloadData;

    var wrappedOnSuccessfulUpdate = demuxed([
        onHide, onSuccessulUpdate,
    ]);

    var handleSubmit = createSend(() => ({
        type: 'experiment/create-from-awayteam-reservation',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId: teamRecord._id,
                interval,
                locationId: locationRecord._id,
                subjectIds: selectedSubjectRecords.map(it => it._id)
            }
        }
    }), { onSuccessfulUpdate: wrappedOnSuccessfulUpdate });

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Bestätigen</Modal.Title>
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
                <Pair label='Tag'>
                    { datefns.format(interval.start, 'cccc P')}
                </Pair>
                
                <Pair label='Location'>
                    { locationRecord._recordLabel }
                </Pair>
                    
                <Table size='sm' className='bg-white border mt-2'>
                    <thead>
                        <tr>
                            <th>Proband</th>
                            <th>Alter am Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                        { selectedSubjectRecords.map(record => {
                            var isRed = (
                                record._upcomingExperiments.length > 0
                            );
                            return <tr
                                key={ record._id }
                                className={ isRed ? 'bg-light-red' : '' }
                            >
                                <td>
                                    { record._recordLabel }
                                </td>
                                <td>
                                    { calculateAge({
                                        base: record._ageFrameField,
                                        relativeTo: interval.start,
                                    })}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </Table>

                <div className='d-flex justify-content-end'>
                    <Button onClick={ handleSubmit }>
                        Bestätigen
                    </Button>
                </div>
            </Modal.Body>
            
        </Modal>

    );
}

const WrappedConfirmModal = (ps) => {
    if (!ps.modalPayloadData) {
        return null;
    }
    return <ConfirmModal { ...ps } />
}

export default WrappedConfirmModal;
