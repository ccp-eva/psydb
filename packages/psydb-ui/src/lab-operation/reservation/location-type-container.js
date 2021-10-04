import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
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

        calendarRevision,
    } = state;

    var [
        handleShowCreateModal,
        handleHideCreateModal,

        handleShowDeleteModal,
        handleHideDeleteModal,

        handleReservationCreated,
    ] = useMemo(() => ([
        (payload) => dispatch({ type: 'show-create-modal', payload }),
        () => dispatch({ type: 'hide-create-modal' }),
        (payload) => dispatch({ type: 'show-delete-modal', payload }),
        () => dispatch({ type: 'hide-delete-modal', payload }),

        () => dispatch({ type: 'increase-calendar-revision' }),
    ]))

    var onSelectLocationType = (nextType) => {
        history.push(`${up(url, 1)}/${nextType}`);
    }

    return (
        <>
            <CreateModal
                show={ showCreateModal }
                onHide={ handleHideCreateModal }
                onSuccessfulCreate={ handleReservationCreated}
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
                onSelectLocationType={ onSelectLocationType }

                activeLocationType={ locationRecordType }
                onSelectEmptySlot={ handleShowCreateModal }
                calendarRevision={ calendarRevision }

                locationCalendarListClassName='bg-white'
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
        case 'increase-calendar-revision':
            return {
                ...state,
                calendarRevision: (state.calendarRevision || 0) + 1
            }
    }
} 

export default LocationTypeContainer;
