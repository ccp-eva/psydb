import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
// FIXME: invite-confirm-modal as its also video-calls now

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import intervalfns from '@mpieva/psydb-date-interval-fns';
import { withField } from '@cdxoo/formik-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    Container,
    Row,
    Col,
    Pair,
    Split,
    Form,
    Alert,

    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import { DefaultForm, Fields } from '../../formik';
import ExperimentIntervalSummary from '../../experiment-interval-summary';

import datefns from '../../date-fns';

var formatTime = (datelike, options = {}) => (
    datefns.format(new Date(datelike), 'p', options)
);

const FormContainer = (ps) => {
    var {
        experimentData,
        studyData,
        confirmData,
        minEnd,
    } = ps;

    var {
        type: experimentType,
        state: experimentState
    } = experimentData.record;

    var locale = useUILocale();
    var translate = useUITranslation();

    var { startDate, startTime } = intervalfns.format(
        confirmData, { locale }
    );

    return (
        <div>
            <header className='pb-1'><b>
                { translate('Current') }
            </b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ experimentData.record }
                />
            </div>

            <header className='pb-1 mt-3'><b>
                { translate('Reschedule To') }
            </b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label={ translate('Date') }>
                        { startDate }
                    </Pair>
                    <Pair label={ translate('Start') }>
                        { startTime }
                    </Pair>
                    <Row>
                        <Form.Label className='col-sm-4 col-form-label'>
                            { translate('End') }
                        </Form.Label>
                        <Col sm={8}>
                            <SlotControl
                                dataXPath='$.end'
                                min={ minEnd }
                                max={ confirmData.maxEnd }
                                step={ confirmData.slotDuration }
                            />
                        </Col>
                    </Row>
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

const InhouseConfirmModalBody = (ps) => {
    var {
        onHide,

        experimentData,
        studyData,
        modalPayloadData,
        testableIntervals,

        onSuccessfulUpdate,
    } = ps;

    var { type: experimentType } = experimentData.record;
    var {
        locationRecord,
        reservationRecord,
        experimentRecord,
        start,
        slotDuration,
    } = modalPayloadData;

    var record = (
        reservationRecord || experimentRecord
    );

    var send = useSend((formData) => ({
        type: `experiment/move-${experimentType}`,
        payload: {
            experimentId: experimentData.record._id,
            locationId: locationRecord._id,
            experimentOperatorTeamId: (
                record.state.experimentOperatorTeamId
            ),
            interval: {
                start: start.toISOString(),
                end: formData.end,
            },
            shouldRemoveOldReservation: formData.shouldRemoveOldReservation
        }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    var minEnd = new Date(start.getTime() + slotDuration);
    var initialValues = {
        end: minEnd.toISOString(),
        shouldRemoveOldReservation: false
    }

    var { start, maxEnd } = modalPayloadData;
    var isSubjectTestable = false;
    //console.log({ testableIntervals });
    if (testableIntervals) {
        var intersections = intervalfns.intersect(
            [{ start: start, end: maxEnd }],
            testableIntervals
        );
        //console.log({ intersections });
        isSubjectTestable = intersections.length > 0;
    }

    return (
        <>
            { !isSubjectTestable && (
                <Alert variant='danger'>
                    <b>Nicht in Altersfenster</b>
                </Alert>
            )} 
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ send.exec }
            >
                { (formikProps) => (
                    <FormContainer { ...({
                        experimentData,
                        studyData,
                        confirmData: modalPayloadData,
                        minEnd,
                        modalPayloadData,
                    }) } />
                )}
            </DefaultForm>
        </>
    )

}

const InhouseConfirmModal = WithDefaultModal({
    Body: InhouseConfirmModalBody,
    title: 'Reschedule Appointment',
    size: 'md',
    className: '',
    backdropClassName: '',
})

const SlotControl = withField({
    Control: (ps) => {
        var { dataXPath, formikField, min, max, step } = ps;

        var locale = useUILocale();

        var slots = [];
        for (var t = min.getTime(); t < max.getTime(); t += step) {
            slots.push(t - 1);
        }

        return (
            <Form.Control { ...({
                as: 'select',
                ...formikField
            }) } >
                { slots.map(it => (
                    <option
                        key={ it }
                        value={ new Date(it).toISOString() }
                    >
                        { formatTime(it + 1, { locale }) }
                    </option>
                ))}
            </Form.Control>
        )
    },
    DefaultWrapper: 'NoneWrapper'
})

export default InhouseConfirmModal;
