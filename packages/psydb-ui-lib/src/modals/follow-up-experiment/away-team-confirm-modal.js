import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';

import datefns from '../../date-fns';
import { createSend } from '@mpieva/psydb-ui-utils';

import {
    Modal,
    Container,
    Pair,
    Button
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '../../formik';

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

    var handleSubmit = createSend((formData) => ({
        type: 'experiment/create-followup-awayteam',
        payload: {
            sourceExperimentId: experimentData.record._id,
            subjectOp: formData.subjectOp,
            targetExperimentOperatorTeamId: nextTeamRecord._id,
            targetInterval: nextInterval,
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

            <header className='pb-1 mt-3'><b>Folgetermin</b></header>
            <DefaultForm 
                initialValues={{ subjectOp: 'none' }}
                onSubmit={ handleSubmit }
            >
                {(formikProps) => (
                    <>
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
                                <Fields.GenericEnum
                                    dataXPath='$.subjectOp'
                                    uiSplit={[ 4, 8 ]}
                                    labelClassName='px-0'
                                    label='Probanden'
                                    options={{
                                        'none': 'Keine Aktion',
                                        'move-unprocessed': 'Verbleibende Verschieben',
                                        'copy': 'Alle Kopieren',
                                    }}
                                />
                            </Container>
                        </div>
                        <div className='d-flex justify-content-end mt-3'>
                            <Button type='submit'>Speichern</Button>
                        </div>
                    </>
                )}
            </DefaultForm>
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
                <Modal.Title>Folgetermin</Modal.Title>
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
