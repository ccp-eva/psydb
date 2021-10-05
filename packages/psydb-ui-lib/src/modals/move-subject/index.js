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

    var confirmModal = useModalReducer({ show: false });

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;
    studyData = studyData || fetched.data.studyData;
    subjectDataByType = subjectDataByType || fetched.data.subjectDataByType;

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;
    var { subjectId, subjectType } = payloadData;

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
                <Modal.Title>Proband verschieben</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <ConfirmModal { ...({
                    ...confirmModal.passthrough,

                    experimentData,
                    studyData,
                    subjectData: { record: subjectRecord },

                    onSuccessfulUpdate: wrappedOnSuccessfulUpdate,
                }) } />

                <StudyInhouseLocations
                    studyId={ studyId }
                    studyRecordType={ studyRecordType }

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
