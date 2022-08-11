import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Alert } from '@mpieva/psydb-ui-layout';


import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

// FIXME
import ExperimentCreateModal from '../../../lab-operation/subject-selection/invite/experiment-create-modal'
import ExperimentUpdateModal from '../../../lab-operation/subject-selection/invite/experiment-update-modal'

const Schedule = (ps) => {
    var {
        selectedStudy,
        subjectRecord,
        inviteType,
        testableIntervals,
        revision,
        onSuccessfulUpdate
    } = ps;

    var experimentCreateModal = useModalReducer();
    var experimentUpdateModal = useModalReducer();
    
    var studyId = selectedStudy?._id;
    var studyData = { records: [ selectedStudy ] };
    var subjectId = subjectRecord._id;
    var subjectLabel = subjectRecord._recordLabel;

    return (
        !selectedStudy || !inviteType
        ? (
            <Alert variant='info'>
                <i>Bitte Studie und Termin-Typ wählen</i>
            </Alert>
        )
        : (
            <>
                <ExperimentCreateModal
                    show={ experimentCreateModal.show }
                    onHide={ experimentCreateModal.handleHide }
                    onSuccessfulCreate={ onSuccessfulUpdate }
                    
                    inviteType={ inviteType }
                    //desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ selectedStudy._testableIntervals }
                    
                    studyData={ studyData }
                    subjectId={ subjectId }
                    subjectLabel={ subjectLabel }
                    { ...experimentCreateModal.data }
                />

                <ExperimentUpdateModal
                    { ...experimentUpdateModal.passthrough }
                    
                    inviteType={ inviteType }
                    //desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ selectedStudy._testableIntervals }

                    studyData={ studyData }
                    subjectId={ subjectId }
                    subjectLabel={ subjectLabel }
                    
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
                <StudyInhouseLocations
                    studyId={ selectedStudy._id }
                    studyRecordType={ selectedStudy.type }
                    subjectRecordType={ subjectRecord.type }
                    currentExperimentType={ inviteType }
                    currentSubjectRecord={ subjectRecord }
                    //desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ selectedStudy._testableIntervals }

                    //activeLocationType={ 'instituteroom' }
                    onSelectReservationSlot={ experimentCreateModal.handleShow }
                    onSelectExperimentSlot={ experimentUpdateModal.handleShow}
                    calendarRevision={ revision || 0 }
                    
                    //locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
                />
            </>
        )
    );
}

export default Schedule;
