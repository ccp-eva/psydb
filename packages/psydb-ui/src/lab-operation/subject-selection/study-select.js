import React, { useState, useEffect, useReducer } from 'react';

import {
    useRouteMatch,
    useParams
} from 'react-router-dom';

import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import StudySelectList from '@mpieva/psydb-ui-lib/src/study-select-list';

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'selected-studies/set':
            return ({
                ...state,
                selectedStudies: [ payload.record ]
            })
        case 'selected-studies/add':
            var nextSelectedStudies = [
                ...state.selectedStudies,
                payload.record,
            ];
            return ({
                ...state,
                selectedStudies: nextSelectedStudies
            });
        case 'selected-studies/remove':
            var nextSelectedStudies = state.selectedStudies.filter(it => (
                it._id !== payload.id
            ));
            return ({
                ...state,
                selectedStudies: nextSelectedStudies
            });
    }
}

const StudySelect = ({
    experimentType,
    singleStudy,
}) => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {
        selectedStudies: [],
    });

    var { selectedStudies } = state;

    return (
        <div>
            <div
                className='p-2 d-flex justify-content-between align-items-center'
                style={{
                    position: 'sticky',
                    top: 0,
                    background: '#ffffff',
                }}
            >
                <b>{
                    singleStudy
                    ? '' 
                    : `Ausgewählt: ${selectedStudies.length}`
                }</b>
                <LinkButton
                    to={ `${url}/${selectedStudies.map(it => it._id).join(',')}`}
                    disabled={ selectedStudies.length < 1 }
                >
                    Weiter
                </LinkButton>
            </div>

            <StudySelectList
                studyRecordType={ studyType }
                experimentType={ experimentType }

                showSelectionIndicator={ true }
                selectedRecordIds={ selectedStudies.map(it => it._id) }
                onSelectRecord={ ({ type, payload }) => {
                    if (singleStudy) {
                        dispatch({
                            type: `selected-studies/set`,
                            payload
                        });
                    }
                    else {
                        dispatch({
                            type: `selected-studies/${type}`,
                            payload
                        });
                    }
                }}
            />

        </div>
    );
}

export default StudySelect;
