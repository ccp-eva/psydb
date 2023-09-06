import React, { useState } from 'react';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button, Alert } from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';
import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';


const CreateModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        inviteType,
        desiredTestInterval,
        testableIntervals,

        studyData,
        subjectId,
        subjectLabel,

        onSuccessfulUpdate,
    } = ps;

    var {
        studyId,
        locationRecord,
        reservationRecord,
        teamRecords,
        start,
        slotDuration,
        maxEnd,
    } = modalPayloadData;

    var translate = useUITranslation();

    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;

    var locationId = locationRecord._id;
    var experimentOperatorTeamId = (
        reservationRecord.state.experimentOperatorTeamId
    );

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(new Date(minEnd.getTime() - 1));

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

    var shouldHide = !enableFollowUpExperiments;
    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
        onSuccessfulUpdate && onSuccessfulUpdate(shouldHide, ...args);
    };

    var messageType = undefined;
    if (inviteType === 'inhouse') {
        messageType = 'experiment/create-from-inhouse-reservation';
    }
    else if (inviteType === 'online-video-call') {
        messageType = 'experiment/create-from-online-video-call-reservation';
    }

    var send = useSend(() => ({
        type: messageType,
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId,
                locationId,
                //subjectIds: [ subjectId ],
                subjectData: [{ subjectId, comment, autoConfirm }],

                interval: {
                    start: start.toISOString(),
                    end: end.toISOString()
                }
            }
        }
    }), {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ subjectId, comment, autoConfirm ]
    });

    return (
        <>
            { !isSubjectTestable && (
                <Alert variant='danger'>
                    <b>{ translate('Not in Age Range') }</b>
                </Alert>
            )} 
            <ExperimentShortControls { ...({
                subjectLabel,

                start,
                end,
                minEnd,
                maxEnd,
                slotDuration,

                comment,
                autoConfirm,

                onChangeComment: setComment,
                onChangeAutoConfirm: setAutoConfirm,
                onChangeEnd: setEnd,
            })} />

            <hr />
            <div className='d-flex justify-content-end'>
                <Button size='sm' onClick={ send.exec }>
                    { translate('Save') }
                </Button>
            </div>
        </>
    );
}

const CreateModal = WithDefaultModal({
    Body: CreateModalBody,

    size: 'md',
    title: 'Appointment',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-white'
});

export default CreateModal;
