import React, { useReducer, useEffect } from 'react';

import agent from '@mpieva/psydb-ui-request-agents';
import {
    LoadingIndicator,
    PillNav,
} from '@mpieva/psydb-ui-layout';

const StudyPillNav = ({
    subjectRecordType,
    experimentType,
    researchGroupId,

    selectedStudyId,
    onSelectStudy,
}) => {
    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        records,
    } = state;

    useEffect(() => {
        agent.fetchSelectableStudiesForCalendar({
            subjectRecordType,
            experimentType,
            researchGroupId,
        })
        .then(response => {
            dispatch({ type: 'init', payload: {
                ...response.data.data
            }})
        })
    }, [ subjectRecordType, experimentType ])

    if (!records) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    return (
        <div>
            <PillNav
                items={[
                    // FIXME: key cannot be undefined but null
                    // works w/o warnings
                    { key: null, label: 'Alle' },
                    ...records.map(it => ({
                        key: it._id,
                        label: it._recordLabel
                    }))
                ]}
                activeKey={ selectedStudyId  }
                onItemClick={ onSelectStudy }
            />
        </div>
    )
};

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            return {
                ...state,
                records: payload.records,
            }
    }
}

export default StudyPillNav;
