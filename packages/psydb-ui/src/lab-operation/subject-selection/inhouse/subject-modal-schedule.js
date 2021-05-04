import React, { useState, useEffect, useReducer } from 'react';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

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
    } = state;

    return (
        <div>
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

                activeLocationType={ 'instituteroom' }
                onSelectEmptySlot={ () => {} }
                calendarRevision={ 0 }
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
    }
}

export default SubjectModalSchedule;
