import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import StudyInhouseLocations from '../../study-inhouse-locations';

import ConfirmModal from './confirm-modal';

const MoveSubjectModalBody = (ps) => {
    var {
        show,
        onHide,

        shouldFetch,
        experimentId,
        experimentType,

        experimentData,
        studyData,
        subjectDataByType,
        payloadData, // FIXME: make obsolete
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    modalPayloadData = modalPayloadData || payloadData;
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentType, experimentId ]);

    var [ didFetchTestability, fetchedTestability ] = useFetch((agent) => {
        if (didFetch) {
            var { subjectId } = modalPayloadData;
        
            studyData = studyData || fetched.data.studyData;
            var studyId = studyData.record._id;

            return agent.fetchSubjectPossibleTestIntervals({
                studyId,
                subjectIds: [ subjectId ],
                labProcedureTypeKey: experimentType,
            })
        }
    }, [ experimentType, didFetch ])

    var confirmModal = useModalReducer({ show: false });

    if (shouldFetch && !didFetch) {
        return null;
    }
    if (!didFetchTestability || !fetchedTestability.data) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;
    studyData = studyData || fetched.data.studyData;
    subjectDataByType = subjectDataByType || fetched.data.subjectDataByType;

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;
    var { subjectId, subjectType, subjectRecord } = modalPayloadData;

    var subjectRecord = subjectDataByType[subjectType].records.find(it => (
        it._id === subjectId
    ));

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    return (
        <>
            <ConfirmModal { ...({
                ...confirmModal.passthrough,

                experimentData,
                studyData,
                subjectData: { record: subjectRecord },

                testableIntervals: fetchedTestability.data.testableIntervals,
                onSuccessfulUpdate: demuxed([
                    onHide, onSuccessfulUpdate
                ]),
            }) } />

            <StudyInhouseLocations
                studyId={ studyId }
                studyRecordType={ studyRecordType }
                subjectRecordType={ subjectType }
                currentExperimentId={ experimentId }
                currentExperimentType={ experimentType }
                currentSubjectRecord={ subjectRecord }
                testableIntervals={ fetchedTestability.data.testableIntervals }

                //activeLocationType={ 'instituteroom' }
                onSelectReservationSlot={ 
                    confirmModal.handleShow
                }
                onSelectExperimentSlot={
                    confirmModal.handleShow
                }
                calendarRevision={ 0 }
                
                locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
            />
        </>
    )
}

const MoveSubjectModal = WithDefaultModal({
    Body: MoveSubjectModalBody,

    size: 'xl',
    title: 'Reschedule Subject',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default MoveSubjectModal;
