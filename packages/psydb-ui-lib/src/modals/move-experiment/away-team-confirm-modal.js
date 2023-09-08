import React from 'react';

import {
    format as formatDateInterval
} from '@mpieva/psydb-date-interval-fns';

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';

import {
    Container,
    Pair,
    Button,

    WithDefaultModal,
    TeamLabel
} from '@mpieva/psydb-ui-layout';

import datefns from '../../date-fns';
import { DefaultForm, Fields } from '../../formik';

const FormContainer = (ps) => {
    var {
        experimentData,
        teamData,
        
        nextTeamRecord,
        nextInterval,
    } = ps;

    var translate = useUITranslation();
    var locale = useUILocale();

    var formatOptions = { dateFormat: 'cccc P', locale };
    var formattedNow = formatDateInterval(
        experimentData.record.state.interval, formatOptions
    );
    var formattedNext = formatDateInterval(
        nextInterval, formatOptions
    );

    return (
        <div>
            <header className='pb-1'><b>
                { translate('Current') }
            </b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label={ translate('Date') }>
                        { formattedNow.startDate }
                    </Pair>
                    <Pair label={ translate('Team') }>
                        <TeamLabel { ...teamData.record.state } />
                    </Pair>
                </Container>
            </div>

            <header className='pb-1 mt-3'><b>
                { translate('Reschedule To') }
            </b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label={ translate('Date') }>
                        { formattedNext.startDate }
                    </Pair>
                     <Pair label={ translate('Team') }>
                        <TeamLabel { ...nextTeamRecord.state } />
                    </Pair>
                </Container>
            </div>
            <div className='d-flex justify-content-between mt-3'>
                <Fields.PlainCheckbox
                    dataXPath='$.shouldRemoveOldReservation'
                    label={ translate('Remove Old Reservation') }
                />
                <Button type='submit'>
                    { translate('Reschedule') }
                </Button>
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
    title: 'Reschedule Appointment',
    size: 'md',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-light'
});

export default AwayTeamConfirmModal;
