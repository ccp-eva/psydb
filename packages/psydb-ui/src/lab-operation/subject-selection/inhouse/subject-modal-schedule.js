import React, { useMemo, useEffect, useReducer } from 'react';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

import ExperimentCreateModal from './experiment-create-modal';

const SubjectModalSchedule = ({
    subjectId,
    subjectLabel,
    studyNavItems,
    studyRecordType,
}) => {

    var [ state, dispatch ] = useReducer(reducer, {
        studyId: studyNavItems[0].key
    });

    var {
        studyId,
        showCreateModal,
        createModalData,
        
        calendarRevision,
    } = state;

    var [
        handleShowCreateModal,
        handleHideCreateModal,

        handleExperimentCreated,
    ] = useMemo(() => ([
        (payload) => dispatch({ type: 'show-create-modal', payload }),
        () => dispatch({ type: 'hide-create-modal' }),

        () => {
            dispatch({ type: 'increase-calendar-revision' })
        },
    ]))

    return (
        <div>
            <ExperimentCreateModal
                show={ showCreateModal }
                onHide={ handleHideCreateModal }
                onSuccessfulCreate={ handleExperimentCreated }
                subjectId={ subjectId }
                subjectLabel={ subjectLabel }
                { ...createModalData }
            />

            <TabNav
                items={ studyNavItems }
                activeKey={ studyId }
                onItemClick={ (nextKey) => {
                    dispatch({ type: 'select-study', payload: {
                        studyId: nextKey
                    }})
                }}
            />

            <StudyInhouseLocations
                studyId={ studyId }
                studyRecordType={ studyRecordType }

                //activeLocationType={ 'instituteroom' }
                onSelectReservationSlot={ 
                    calendarRevision > 0
                    ? undefined
                    : handleShowCreateModal
                }
                calendarRevision={ calendarRevision }
                
                locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
            />
        </div>

    )
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'select-study':
            return ({
                ...state,
                studyId: payload.studyId
            })
        
        case 'show-create-modal':
            return {
                ...state,
                showCreateModal: true,
                createModalData: {
                    ...payload
                }
            }
        case 'hide-create-modal':
            return {
                ...state,
                showCreateModal: false,
            }
        case 'increase-calendar-revision':
            return {
                ...state,
                calendarRevision: (state.calendarRevision || 0) + 1
            }
    }
}

export default SubjectModalSchedule;
