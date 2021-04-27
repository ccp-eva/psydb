import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

import CreateModal from './create-modal';
import DeleteModal from './delete-modal';

const LocationTypeContainer = ({
    studyRecord,
    teamRecords,
    customRecordTypeData,
}) => {
    var { path, url } = useRouteMatch();
    var { studyType, locationRecordType } = useParams();
    var history = useHistory();

    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        showCreateModal,
        createModalData,
        showDeleteModal,
        deleteModalData,
    } = state;

    var [
        handleShowCreateModal,
        handleHideCreateModal,

        handleShowDeleteModal,
        handleHideDeleteModal,
    ] = useMemo(() => ([
        (payload) => dispatch({ type: 'show-create-modal', payload }),
        () => dispatch({ type: 'hide-create-modal' }),
        (payload) => dispatch({ type: 'show-delete-modal', payload }),
        () => dispatch({ type: 'hide-delete-modal', payload }),
    ]))

    return (
        <>
            <CreateModal
                show={ showCreateModal }
                onHide={ handleHideCreateModal }
                onSuccessfulCreate={ () => {} }
                { ...createModalData }
            />

            {/*<DeleteModal
                show={ deleteModalState.showModal }
                onHide={ handleHideDeleteModal }
                onSuccessfulDelete={ () => {} }
            />*/}

            <StudyInhouseLocations
                studyId={ studyRecord._id }
                studyRecordType={ studyType }

                activeLocationType={ locationRecordType }

                onSelectEmptySlot={ handleShowCreateModal }
            />
        </>
    );
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
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
        case 'show-delete-modal':
            return {
                ...state,
                showDeleteModal: true,
                deleteModalData: {
                    ...payload
                }
            }
        case 'hide-delete-modal':
            return {
                ...state,
                showDeleteModal: false
            }
    }
} 

export default LocationTypeContainer;
