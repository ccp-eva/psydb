import React, { useState } from 'react';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button, Alert } from '@mpieva/psydb-ui-layout';

import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

const ExperimentUpdateModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        inviteType,
        
        studyData,
        subjectId,
        subjectLabel,
        
        desiredTestInterval,
        testableIntervals,
        ageFrameIntervals,

        onSuccessfulUpdate,
    } = ps;

    var {
        experimentRecord,
        locationRecord,
        slotDuration,
        start,
        studyId
    } = modalPayloadData;

    var translate = useUITranslation();

    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;

    var shouldHide = !enableFollowUpExperiments;
    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulUpdate && onSuccessfulUpdate(shouldHide, ...args);
    };

    var send = useSend(() => ({
        type: 'experiment/add-subject',
        payload: {
            labProcedureTypeKey: inviteType,
            experimentId: experimentRecord._id,
            subjectId,
            comment,
            autoConfirm,
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ experimentRecord, subjectId ]
    });

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var { start, end } = experimentRecord.state.interval;
    end = new Date(end.getTime() + 1);

    var isInAgeFrame = false;
    if (ageFrameIntervals || testableIntervals) {
        isInAgeFrame = intervalfns.intersect(
            [{ start: start, end: end }],
            ageFrameIntervals || testableIntervals
        ).length > 0;
    }

    var isInDesiredTestInterval = true;
    if (desiredTestInterval) {
        isInDesiredTestInterval = intervalfns.intersect(
            [{ start: start, end: end }],
            [ desiredTestInterval ]
        ).length > 0;
    }

    return (
        <>
            { !isInAgeFrame && (
                <Alert variant='danger'>
                    <b>{ translate('Not in Age Range') }</b>
                </Alert>
            )}
            { isInAgeFrame && !isInDesiredTestInterval && (
                <Alert variant='warning'>
                    <b>{ translate('Not in Desired Test Interval!') }</b>
                </Alert>
            )}
            <ExperimentShortControls {...({
                start,
                end,
                subjectLabel,
                onChangeComment: setComment,
                onChangeAutoConfirm: setAutoConfirm,
            })} />
            <hr />
            <div className='d-flex justify-content-end'>
                <Button onClick={ send.exec }>
                    { translate('Add') }
                </Button>
            </div>
        </>
    );
}

const ExperimentUpdateModal = WithDefaultModal({
    Body: ExperimentUpdateModalBody,

    size: 'md',
    title: 'Appointment',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-white'
});

export default ExperimentUpdateModal;
