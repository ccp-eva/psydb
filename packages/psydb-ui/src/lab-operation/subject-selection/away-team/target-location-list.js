import React, { useReducer } from 'react';
import { Base64 } from 'js-base64';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import { without, omit } from '@mpieva/psydb-core-utils';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

import { datefns } from '@mpieva/psydb-ui-lib';


import { convertFilters } from '../convert-filters';

import StudySummary from '../study-summary';
import TargetLocationTable from './target-location-table';
import EditLocationCommentModal from './edit-location-comment-modal';
import ExperimentScheduleModal from './experiment-schedule-modal';

const TargetLocationList = (ps) => {
    var {
        studyLabelItems
    } = ps;

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

    var translate = useUITranslation();
    var { value: revision, up: increaseRevision } = useRevision();

    var pagination = usePaginationReducer({
        limit: 250, // FIXME: make configurable
    });
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

    var studyIds = joinedStudyIds.split(',');
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
        var delta = without(
            subjectRecords.map(it => it._id),
            selectedSubjectIds || [],
        )
        var set = (
            selectedSubjectIds.length > 0 && delta.length === 0
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
            updateQuery(omit({ from: query, paths: [ 'location' ] }));
        }
        else {
            updateQuery({ ...query, location: locationId });
        }
        dispatch({ type: 'selected-subjects/set', payload: {
            subjectRecords: [],
        }})
    }

    var editLocationCommentModal = useModalReducer();
    var createExperimentModal = useModalReducer();

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
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
            <EditLocationCommentModal
                { ...editLocationCommentModal.passthrough }
                onSuccessfulUpdate={ increaseRevision }
            />
            <ExperimentScheduleModal { ...({
                ...createExperimentModal.passthrough,
                studyId: joinedStudyIds.split(',')[0],
                studyType,
                
                onSuccessfulUpdate: increaseRevision
            }) } />
          
            <StudySummary studyId={ joinedStudyIds.split(',')[0] } />

            <div className='sticky-top border-bottom'>
                <div className='bg-light pt-2 pb-2 pr-3 pl-3 border-bottom'>
                    <b>{ translate('Subjects Found') }:</b> { subjectCount }
                </div>
                <Pagination
                    totalLabel={ translate('Locations') + ':' }
                    { ...pagination }
                />
            </div>
            
            <TargetLocationTable { ...({
                studyIds,
                mergedRecords,
                subjectMetadata,
                subjectExperimentMetadata,
                locationMetadata,
                locationExperimentMetadata,

                onToggleDetails: handleToggleDetails,
                selectedLocationId,

                onEditLocationComment: editLocationCommentModal.handleShow,
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
