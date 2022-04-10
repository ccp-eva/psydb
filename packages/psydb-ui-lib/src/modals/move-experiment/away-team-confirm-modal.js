import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';

import datefns from '../../date-fns';
import { useSend } from '@mpieva/psydb-ui-hooks';

import {
    Modal,
    Container,
    Pair,
    Button,

    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import { DefaultForm, Fields } from '../../formik';

const FormContainer = (ps) => {
    var {
        experimentData,
        teamData,
        
        nextTeamRecord,
        nextInterval,
    } = ps;

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
                            'dd.MM.yyyy HH:mm'
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
                            'dd.MM.yyyy HH:mm'
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
            <div className='d-flex justify-content-between mt-3'>
                <Fields.PlainCheckbox
                    dataXPath='$.shouldRemoveOldReservation'
                    label='Alte Reservierung entfernen'
                />
                <Button type='submit'>Verschieben</Button>
            </div>
        </div>
    )

}

const AwayTeamConfirmModalBody = (ps) => {
    var {
        experimentData,
        teamData,
        modalPayloadData,

        onHide,
        onSuccessfulUpdate,
    } = ps;

    var {
        teamRecord: nextTeamRecord,
        interval: nextInterval,
    } = modalPayloadData;

    var send = useSend((formData) => ({
        type: 'experiment/move-away-team',
        payload: {
            experimentId: experimentData.record._id,
            experimentOperatorTeamId: nextTeamRecord._id,
            interval: nextInterval,
            shouldRemoveOldReservation: formData.shouldRemoveOldReservation
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] })

    var initialValues = { shouldRemoveOldReservation: false };

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ send.exec }
        >
            { (formikProps) => (
                <FormContainer { ...({
                    experimentData,
                    teamData,

                    nextTeamRecord,
                    nextInterval,
                }) } />
            )}
        </DefaultForm>
    )
}

const AwayTeamConfirmModal = WithDefaultModal({
    Body: AwayTeamConfirmModalBody,
    title: 'Termin verschieben',
    size: 'md',
    className: '',
    backdropClassName: '',
});

export default AwayTeamConfirmModal;
