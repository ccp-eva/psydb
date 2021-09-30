import React, { useState } from 'react';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

import ExperimentCreateModal from './experiment-create-modal';
import ExperimentUpdateModal from './experiment-update-modal';

import {
    useModalReducer,
    useCallbackMaybe
} from '@mpieva/psydb-ui-hooks';

const SubjectModalSchedule = ({
    onHide,

    subjectId,
    subjectRecordType,
    subjectLabel,
    studyNavItems,
    studyRecordType,

    onSuccessfulUpdate,
}) => {

    var [ studyId, setStudyId ] = useState(studyNavItems[0].key);
    
    var experimentCreateModal = useModalReducer();
    var experimentUpdateModal = useModalReducer();

    var handleExperimentCreated = useCallbackMaybe(onSuccessfulUpdate);

    return (
        <div>
            <ExperimentCreateModal
                show={ experimentCreateModal.show }
                onHide={ experimentCreateModal.handleHide }
                onSuccessfulCreate={ handleExperimentCreated }
                subjectId={ subjectId }
                subjectLabel={ subjectLabel }
                { ...experimentCreateModal.data }
            />

            <ExperimentUpdateModal
                { ...experimentUpdateModal.passthrough }
                
                subjectId={ subjectId }
                subjectLabel={ subjectLabel }
                
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />

            <TabNav
                items={ studyNavItems }
                activeKey={ studyId }
                onItemClick={ setStudyId }
            />

            <StudyInhouseLocations
                studyId={ studyId }
                studyRecordType={ studyRecordType }
                subjectRecordType={ subjectRecordType }

                //activeLocationType={ 'instituteroom' }
                onSelectReservationSlot={ experimentCreateModal.handleShow }
                onSelectExperimentSlot={ experimentUpdateModal.handleShow}
                calendarRevision={ 0 }
                
                locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
            />
        </div>

    )
}

export default SubjectModalSchedule;
