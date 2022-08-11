import React from 'react';
import {
    Modal,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import {
    useFetch,
    useModalReducer
} from '@mpieva/psydb-ui-hooks';

import StudyInhouseLocations from '../../study-inhouse-locations';

import ConfirmModal from './confirm-modal';

const MoveSubjectModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <MoveSubjectModal { ...ps } />
    );
}

const MoveSubjectModal = ({
    show,
    onHide,

    shouldFetch,
    experimentId,
    experimentType,

    experimentData,
    studyData,
    subjectDataByType,
    payloadData,

    onSuccessfulUpdate,
}) => {
    
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
            var { subjectId } = payloadData;
        
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
    var { subjectId, subjectType, subjectRecord } = payloadData;

    var subjectRecord = subjectDataByType[subjectType].records.find(it => (
        it._id === subjectId
    ));

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide(),
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    };

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Proband:in verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <ConfirmModal { ...({
                    ...confirmModal.passthrough,

                    experimentData,
                    studyData,
                    subjectData: { record: subjectRecord },

                    testableIntervals: fetchedTestability.data.testableIntervals,
                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
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

            </Modal.Body>
        </Modal>
    )
}


export default MoveSubjectModalWrapper;
