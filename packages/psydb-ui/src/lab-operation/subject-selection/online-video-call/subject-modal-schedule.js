import React, { useState } from 'react';

import {
    TabNav
} from '@mpieva/psydb-ui-layout';

import {
    useModalReducer,
    useCallbackMaybe
} from '@mpieva/psydb-ui-hooks';

import ExistingSubjectExperiments from '@mpieva/psydb-ui-lib/src/experiments/shortlist-by-study-and-subject';
import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

import ExperimentCreateModal from './experiment-create-modal';
import ExperimentUpdateModal from './experiment-update-modal';

const SubjectModalSchedule = ({
    onHide,
    revision,

    studyData,
    subjectId,
    subjectRecordType,
    subjectLabel,
    studyNavItems,
    studyRecordType,

    onSuccessfulUpdate,
}) => {

    var [ studyId, setStudyId ] = useState(studyNavItems[0].key);
    var studyLabel = studyNavItems.find(it => it.key === studyId).label;
    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;
    
    var experimentCreateModal = useModalReducer();
    var experimentUpdateModal = useModalReducer();

    var handleExperimentCreated = useCallbackMaybe(onSuccessfulUpdate);

    return (
        <div>
            <ExperimentCreateModal
                show={ experimentCreateModal.show }
                onHide={ experimentCreateModal.handleHide }
                studyData={ studyData }
                onSuccessfulCreate={ handleExperimentCreated }
                subjectId={ subjectId }
                subjectLabel={ subjectLabel }
                { ...experimentCreateModal.data }
            />

            <ExperimentUpdateModal
                { ...experimentUpdateModal.passthrough }
                
                studyData={ studyData }
                subjectId={ subjectId }
                subjectLabel={ subjectLabel }
                
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />

            <TabNav
                items={ studyNavItems }
                activeKey={ studyId }
                onItemClick={ setStudyId }
            />

            { enableFollowUpExperiments && (
                <>
                    <header className='mb-1 mt-2'>
                        <b>Termine des Probanden in { studyLabel }</b>
                    </header>
                    <div className='bg-white border px-3 py-2 mb-2'>
                        <ExistingSubjectExperiments
                            subjectId={ subjectId }
                            studyId={ studyId }
                            revision={ revision || 0}
                        />
                    </div>
                </>
            )}

            <StudyInhouseLocations
                studyId={ studyId }
                studyRecordType={ studyRecordType }
                subjectRecordType={ subjectRecordType }
                currentExperimentType='online-video-call'
                currentSubjectRecord={{ _id: subjectId /* FIXME */ }}

                //activeLocationType={ 'instituteroom' }
                onSelectReservationSlot={ experimentCreateModal.handleShow }
                onSelectExperimentSlot={ experimentUpdateModal.handleShow}
                calendarRevision={ revision || 0 }
                
                locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
            />
        </div>

    )
}

export default SubjectModalSchedule;
