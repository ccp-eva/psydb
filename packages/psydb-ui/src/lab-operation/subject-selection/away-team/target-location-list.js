import React, { useReducer } from 'react';
import { Base64 } from 'js-base64';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import omit from '@cdxoo/omit';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    useFetch,
    useRevision,
    useModalReducer,
    usePaginationReducer,
    useURLSearchParams,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination
} from '@mpieva/psydb-ui-layout';

import { convertFilters } from '../convert-filters';

import StudySummary from '../study-summary';
import TargetLocationTable from './target-location-table';
import ExperimentScheduleModal from './experiment-schedule-modal';

const TargetLocationList = ({
    studyLabelItems
}) => {

    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds: joinedStudyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

    var userSearchSettings = undefined;
    try {
        userSearchSettings = JSON.parse(Base64.decode(searchSettings64));
    }
    catch (e) {}

    //console.log({ userSearchSettings });

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var { value: revision, up: increaseRevision } = useRevision();

    var pagination = usePaginationReducer();
    var { offset, limit } = pagination;
    
    var [ state, dispatch ] = useReducer(reducer, {
        selectedSubjectsLocationId: undefined,
        selectedSubjects: []
    });

    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            interval,
            filters,
        } = userSearchSettings;

        var { start, end } = interval;

        return agent.searchSubjectsTestableViaAwayTeam({
            subjectTypeKey: subjectRecordType,
            studyTypeKey: studyType,
            studyIds: joinedStudyIds.split(','),
            interval: {
                start: datefns.startOfDay(new Date(start)),
                end: datefns.endOfDay(new Date(end)),
            },
            filters: convertFilters(filters),

            offset,
            limit,
        }).then(response => {
            pagination.setTotal(response.data.data.locationCount);
            dispatch({ type: 'selected-subjects/set', payload: {
                locationId: undefined, subjectRecords: [],
            }})

            return response;
        })
    }, [
        joinedStudyIds, subjectRecordType, searchSettings64,
        revision, offset, limit
    ]);

    var selectedSubjectIds = state.selectedSubjects.map(it => it._id);

    var handleSelectSubject = ({ locationId, subjectRecord }) => {
        var exists = selectedSubjectIds.includes(subjectRecord._id);
        if (!exists) {
            dispatch({ type: 'selected-subjects/add', payload: {
                locationId, subjectRecord
            }});
        }
        else {
            dispatch({ type: 'selected-subjects/remove', payload: {
                subjectRecord
            }});
        }
    }

    var handleSelectManySubjects = ({ locationId, subjectRecords }) => {
        var set = (
            selectedSubjectIds.length > 0
            ? []
            : subjectRecords
        );
        dispatch({ type: 'selected-subjects/set', payload: {
            locationId, subjectRecords: set
        }});
    }

    var [ query, updateQuery ] = useURLSearchParams();
    var { location: selectedLocationId } = query;
    var handleToggleDetails = ({ locationId }) => {
        if (selectedLocationId === locationId) {
            updateQuery({ ...omit('location', query) });
        }
        else {
            updateQuery({ ...query, location: locationId });
        }
        dispatch({ type: 'selected-subjects/set', payload: {
            subjectRecords: [],
        }})
    }

    var createExperimentModal = useModalReducer();

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        )
    }

    var {
        mergedRecords,
        subjectMetadata,
        subjectExperimentMetadata,
        subjectCount,

        locationMetadata,
        locationExperimentMetadata,
        locationCount,
    } = fetched.data;

    return (
        <>
            <ExperimentScheduleModal { ...({
                show: createExperimentModal.show,
                onHide: createExperimentModal.handleHide,
                modalPayloadData: createExperimentModal.data,
                studyId: joinedStudyIds.split(',')[0],
                studyType,
                
                onSuccessfulUpdate: increaseRevision
            }) } />
          
            <StudySummary studyId={ joinedStudyIds.split(',')[0] } />

            <div className='sticky-top border-bottom'>
                <div className='bg-light pt-2 pb-2 pr-3 pl-3 border-bottom'>
                    <b>gefundene Probanden:</b> { subjectCount }
                </div>
                <Pagination
                    totalLabel='Locations:'
                    { ...pagination }
                />
            </div>
            
            <TargetLocationTable { ...({
                mergedRecords,
                subjectMetadata,
                subjectExperimentMetadata,
                locationMetadata,
                locationExperimentMetadata,

                onToggleDetails: handleToggleDetails,
                selectedLocationId,

                onSelectSubject: handleSelectSubject,
                onSelectManySubjects: handleSelectManySubjects,
                selectedSubjectIds,

                onCreateExperiment: ({ locationRecord }) => (
                    createExperimentModal.handleShow({
                        locationRecord,
                        selectedSubjectRecords: state.selectedSubjects,
                    })
                )
            }) } />
        </>
    );
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'selected-subjects/set':
            var { locationId, subjectRecords } = payload;
            return ({
                ...state,
                selectedSubjectsLocationId: locationId,
                selectedSubjects: subjectRecords
            });
            break;
        case 'selected-subjects/add':
            var { locationId, subjectRecord } = payload;
            
            var nextSelectedSubjects;
            if (state.selectedSubjectsLocationId === locationId) {
                nextSelectedSubjects = [
                    ...state.selectedSubjects,
                    subjectRecord
                ];
            }
            else {
                nextSelectedSubjects = [ subjectRecord ];
            }
            return ({
                ...state,
                selectedSubjectsLocationId: locationId,
                selectedSubjects: nextSelectedSubjects
            });

            break;

        case 'selected-subjects/remove':
            var nextSelectedSubjects = state.selectedSubjects.filter(it => (
                it._id !== payload.subjectRecord._id
            ));
            return ({
                ...state,
                selectedSubjects: nextSelectedSubjects
            });
            break;
    }
}

export default TargetLocationList;
