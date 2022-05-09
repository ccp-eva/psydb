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
import Experiments from '../../experiments/shortlist-by-study-and-subject';

import ConfirmModal from './confirm-modal';

const FollowUpSubjectModalWrapper = (ps) => {
    if (!ps.show) {
        return null;
    }
    return (
        <FollowUpSubjectModal { ...ps } />
    );
}

const FollowUpSubjectModal = ({
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

    var confirmModal = useModalReducer({ show: false });

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;
    studyData = studyData || fetched.data.studyData;
    subjectDataByType = subjectDataByType || fetched.data.subjectDataByType;

    var studyId = studyData.record._id;
    var studyLabel = studyData.record.state.shorthand;
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
                <Modal.Title>Folgetermin</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <ConfirmModal { ...({
                    ...confirmModal.passthrough,

                    experimentData,
                    studyData,
                    subjectData: { record: subjectRecord },

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } />

                <header className='mb-1'>
                    <b>Termine des Proband:innen in { studyLabel }</b>
                </header>
                <div className='bg-white border px-3 py-2 mb-3'>
                    <Experiments
                        studyId={ studyId }
                        subjectId={ subjectId }
                    />
                </div>

                <StudyInhouseLocations
                    studyId={ studyId }
                    studyRecordType={ studyRecordType }
                    subjectRecordType={ subjectType }
                    currentExperimentId={ experimentId }
                    currentExperimentType={ experimentType }
                    currentSubjectRecord={ subjectRecord }

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


export default FollowUpSubjectModalWrapper;
