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

    var isSubjectTestable = false;
    //console.log({ testableIntervals });
    if (testableIntervals) {
        var intersections = intervalfns.intersect(
            [{ start: start, end: end }],
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
            <ExperimentShortControls {...({
                start,
                end,
                subjectLabel,
                onChangeComment: setComment,
                onChangeAutoConfirm: setAutoConfirm,
            })} />
            <hr />
            <div className='d-flex justify-content-end'>
                <Button size="sm" onClick={ send.exec }>
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
