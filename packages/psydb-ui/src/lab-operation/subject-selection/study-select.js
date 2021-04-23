import React, { useState, useEffect, useReducer } from 'react';

import {
    useRouteMatch,
    useParams
} from 'react-router-dom';

import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'selected-study-ids/add':
            var nextSelectedStudyIds = [
                ...state.selectedStudyIds,
                payload.id,
            ];
            return ({
                ...state,
                selectedStudyIds: nextSelectedStudyIds
            });
        case 'selected-study-ids/remove':
            var nextSelectedStudyIds = state.selectedStudyIds.filter(id => (
                id !== payload.id
            ));
            return ({
                ...state,
                selectedStudyIds: nextSelectedStudyIds
            });
    }
}

const StudySelect = () => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {
        selectedStudyIds: [],
    });

    var { selectedStudyIds } = state;

    return (
        <div>
            <div
                className='p-2'
                style={{
                    position: 'sticky',
                    top: 0,
                    background: '#ffffff',
                }}
            >
                <b>Ausgewählt: { selectedStudyIds.length }</b>
                {' '}
                <LinkButton
                    to={ `${url}/${selectedStudyIds.join(',')}`}
                    disabled={ selectedStudyIds.length < 1 }
                >
                    Suchen
                </LinkButton>
            </div>

            <RecordListContainer
                collection='study'
                recordType={ studyType }
                linkBaseUrl={ url }
                showSelectionIndicator={ true }
                selectedRecordIds={ selectedStudyIds }
                onSelectRecord={ ({ type, payload }) => {
                    dispatch({ type: `selected-study-ids/${type}`, payload });
                }}
            />

        </div>
    );
}

export default StudySelect;
