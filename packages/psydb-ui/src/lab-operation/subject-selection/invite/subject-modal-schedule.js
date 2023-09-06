import React, { useState } from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useFetch,
    useModalReducer,
    useCallbackMaybe
} from '@mpieva/psydb-ui-hooks';

import { TabNav, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    StudyInhouseLocations,
    ExistingSubjectExperiments,
} from '@mpieva/psydb-ui-lib';

import ExperimentCreateModal from './experiment-create-modal';
import ExperimentUpdateModal from './experiment-update-modal';

const SubjectModalSchedule = (ps) => {
    var {
        onHide,
        revision,

        inviteType,
        desiredTestInterval,
        testableInStudies,

        studyData,
        subjectId,
        subjectRecordType,
        subjectLabel,
        studyNavItems,
        studyRecordType,

        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
    var experimentCreateModal = useModalReducer();
    var experimentUpdateModal = useModalReducer();

    var [ studyId, setStudyId ] = useState(studyNavItems[0].key);

    var studyLabel = studyNavItems.find(it => it.key === studyId).label;
    var studyRecord = studyData.records.find(it => it._id === studyId);
    var { enableFollowUpExperiments } = studyRecord.state;
    
    var testableIntervals = (
        // FIXME
        testableInStudies[`_testableIntervals_${studyId}`]
    );

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSubjectPossibleTestIntervals({
            studyId,
            subjectIds: [ subjectId ],
            labProcedureTypeKey: inviteType,
            // ageFrameIds // TODO
            //desiredTestInterval
        })
    ), [ studyId, subjectId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />;
    }

    var { testableIntervals: fetchedIntervals } = fetched.data;
    var sharedModalBag = {
        inviteType,
        desiredTestInterval,
        testableIntervals: (testableIntervals || fetchedIntervals),
        
        studyData,
        subjectId,
        subjectLabel,
    }

    return (
        <div>
            <ExperimentCreateModal
                { ...experimentCreateModal.passthrough }
                { ...sharedModalBag }

                onSuccessfulCreate={ onSuccessfulUpdate }
            />

            <ExperimentUpdateModal
                { ...experimentUpdateModal.passthrough }
                { ...sharedModalBag }
                
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
                        <b>{ translate(
                            'Subject Appointments in ${study}',
                            { study: studyLabel }
                        ) }</b>
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
                currentExperimentType={ inviteType }
                currentSubjectRecord={{ _id: subjectId /* FIXME */ }}
                desiredTestInterval={ desiredTestInterval }
                testableIntervals={ testableIntervals || fetchedIntervals }

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
