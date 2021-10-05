import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';

import datefns from '../../date-fns';
import { createSend } from '@mpieva/psydb-ui-utils';

import {
    Modal,
    Container,
    Pair,
    Button
} from '@mpieva/psydb-ui-layout';

const FormContainer = ({
    onHide,
    
    experimentData,
    teamData,
    studyData,
    
    nextReservationRecord,
    nextTeamRecord,
    nextInterval,

    onSuccessfulUpdate,
}) => {

    var handleSubmit = createSend(() => ({
        type: 'experiment/move-away-team',
        payload: {
            experimentId: experimentData.record._id,
            experimentOperatorTeamId: nextTeamRecord._id,
            interval: nextInterval,
        }
    }), { onSuccessfulUpdate })

    return (
        <div>
            <header className='pb-1'><b>Aktuell</b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(
                                experimentData.record.state.interval.start
                            ),
                            'cccc P'
                        ) }
                    </Pair>
                    <Pair label='Team'>
                        <span className='d-inline-block mr-2' style={{
                            backgroundColor: teamData.record.state.color,
                            height: '24px',
                            width: '24px',
                            verticalAlign: 'bottom',
                        }} />
                        { teamData.record.state.name }
                    </Pair>
                </Container>
            </div>

            <header className='pb-1 mt-3'><b>nach Verschiebung</b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(nextInterval.start),
                            'ccc P'
                        ) }
                    </Pair>
                     <Pair label='Team'>
                        <span className='d-inline-block mr-2' style={{
                            backgroundColor: nextTeamRecord.state.color,
                            height: '24px',
                            width: '24px',
                            verticalAlign: 'bottom',
                        }} />
                        { nextTeamRecord.state.name }
                    </Pair>
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button onClick={ handleSubmit }>Verschieben</Button>
            </div>
        </div>
    )

}

const AwayTeamConfirmModal = ({
    show,
    onHide,

    experimentData,
    teamData,
    studyData,
    modalPayloadData,

    onSuccessfulUpdate,
}) => {

    if (!modalPayloadData) {
        return null;
    }

    var {
        reservationRecord: nextReservationRecord,
        teamRecord: nextTeamRecord,
        interval: nextInterval,
    } = modalPayloadData;

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Experiment verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <FormContainer { ...({
                    experimentData,
                    teamData,
                    studyData,

                    nextReservationRecord,
                    nextTeamRecord,
                    nextInterval,

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } /> 
            </Modal.Body>
        </Modal>
    )
}

export default AwayTeamConfirmModal;
