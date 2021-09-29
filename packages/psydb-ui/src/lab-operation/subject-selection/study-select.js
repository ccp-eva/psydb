import React, { useState, useEffect, useReducer } from 'react';

import {
    useRouteMatch,
    useParams
} from 'react-router-dom';

import { useSelectionReducer } from '@mpieva/psydb-ui-hooks';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import StudySelectList from '@mpieva/psydb-ui-lib/src/study-select-list';

const StudySelect = ({
    experimentType,
    singleStudy,
}) => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();

    var selection = useSelectionReducer({
        selected: [],
        checkEqual: (existing, payload) => (
            existing._id === payload._id
        )
    })

    var selectedStudies = selection.value;

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
                wholeRowIsClickable={ singleStudy ? true : false }

                selectedRecordIds={ selectedStudies.map(it => it._id) }
                onSelectRecord={ ({ type, payload }) => {
                    if (singleStudy) {
                        selection.set(payload.record);
                    }
                    else {
                        selection[type](payload.record);
                    }
                }}
            />

        </div>
    );
}

export default StudySelect;
