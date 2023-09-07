import React from 'react';
import intervalfns from '@mpieva/psydb-date-interval-fns';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    WithDefaultModal,
    Button,
    Pair,
    Split,
    Alert,
} from '@mpieva/psydb-ui-layout';

import ReservationFormContainer from './reservation-form-container';
import ExperimentFormContainer from './experiment-form-container';

const ConfirmModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        experimentData,
        studyData,
        subjectData,
        testableIntervals,

        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();

    var FormContainer = (
        modalPayloadData.experimentRecord
        ? ExperimentFormContainer
        : ReservationFormContainer
    );

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
                    <b>{ translate('Not in Age Range') }</b>
                </Alert>
            )} 
            <FormContainer { ...({
                confirmData: modalPayloadData,
                experimentData,
                studyData,
                subjectData,

                onSuccessfulUpdate: demuxed([
                    onHide, onSuccessfulUpdate,
                ]),
            }) } />
        </>
    )
}

const ConfirmModal = WithDefaultModal({
    Body: ConfirmModalBody,

    size: 'md',
    title: 'Follow-Up Appointment',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-light'
});

export default ConfirmModal;
