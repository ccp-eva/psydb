import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import StudyInhouseLocations from '../../study-inhouse-locations';
import Experiments from '../../experiments/shortlist-by-study-and-subject';

import ConfirmModal from './confirm-modal';

const FollowUpSubjectModalBody = (ps) => {
    var {
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
    
    var translate = useUITranslation();

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
    var studyLabel = studyData.record.state.shorthand;
    var studyRecordType = studyData.record.type;
    var { subjectId, subjectType, subjectRecord } = modalPayloadData;

    var subjectRecord = subjectDataByType[subjectType].records.find(it => (
        it._id === subjectId
    ));

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

            <header className='mb-1'><b>
                { translate(
                    'Subject Appointments in ${study}',
                    { study: studyLabel}
                )}
            </b></header>
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

const FollowUpSubjectModal = WithDefaultModal({
    Body: FollowUpSubjectModalBody,

    size: 'xl',
    title: 'Follow-Up Appointment',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default FollowUpSubjectModal;
