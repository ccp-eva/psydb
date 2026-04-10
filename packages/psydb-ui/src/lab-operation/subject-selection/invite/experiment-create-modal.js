import React from 'react';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Alert } from '@mpieva/psydb-ui-layout';

//import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

import ExperimentCreateForm from './experiment-create-form';

const CreateModalBody = (ps) => {
    var {
        onHide, modalPayloadData,

        studyData,
        inviteType, desiredTestInterval, testableIntervals,
        subjectId, subjectLabel,
        onSuccessfulUpdate,
    } = ps;

    var {
        studyId, locationRecord, reservationRecord,
        teamRecords,
        start, maxEnd, slotDuration,
    } = modalPayloadData;

    var [{ translate }] = useI18N();

    var minEnd = new Date(start.getTime() + slotDuration);

    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;

    var locationId = locationRecord._id;
    var experimentOperatorTeamId = (
        reservationRecord.state.experimentOperatorTeamId
    );

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

    var send = useSend((formData) => {
        var { comment, autoConfirm, end } = formData;

        return {
            type: messageType,
            payload: { props: {
                studyId,
                experimentOperatorTeamId,
                locationId,
                subjectData: [{ subjectId, comment, autoConfirm }],

                interval: {
                    start: start.toISOString(),
                    end: new Date(end).toISOString()
                }
            }}
        }
    }, {
        onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
        dependencies: [ subjectId ]
    });

    var initialValues = {
        ...ExperimentCreateForm.createDefaults(),
        end: minEnd.getTime(),
    }

    return (
        <>
            { !isSubjectTestable && (
                <Alert variant='danger'>
                    <b>{ translate('Not in Age Range') }</b>
                </Alert>
            )}
            <ExperimentCreateForm.Component
                onSubmit={ send.exec }
                initialValues={ initialValues }
                subjectLabel={ subjectLabel }
                start={ start }
                minEnd={ minEnd }
                maxEnd={ maxEnd }
                slotDuration={ slotDuration }
            />
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
