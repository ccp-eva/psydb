import React, { useReducer } from 'react';
import { Base64 } from 'js-base64';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import omit from '@cdxoo/omit';
import { useURLSearchParams } from '@cdxoo/react-router-url-search-params';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import up from '@mpieva/psydb-ui-lib/src/url-up';
import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';
import useModalReducer from '@mpieva/psydb-ui-lib/src/use-modal-reducer';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

import TargetLocationTable from './target-location-table';
import ExperimentScheduleModal from './experiment-schedule-modal';

const TargetLocationList = ({
    studyLabelItems
}) => {

    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

    var userSearchSettings = undefined;
    try {
        userSearchSettings = JSON.parse(Base64.decode(searchSettings64));
    }
    catch (e) {}

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            timeFrame,
            ageFrames,
            values,
        } = userSearchSettings

        return agent.searchSubjectsTestableViaAwayTeam({
            studyRecordType: studyType,
            subjectRecordType,
            studyIds: studyIds.split(','),
            timeFrameStart: datefns.startOfDay(
                userSearchSettings.timeFrame.start
            ),
            timeFrameEnd: datefns.endOfDay(
                userSearchSettings.timeFrame.end
            ),
            enabledAgeFrames: ageFrames,
            enabledValues: values,
        })
    }, [ studyIds, subjectRecordType, searchSettings64 ]);

    var [ state, dispatch ] = useReducer(reducer, {
        selectedSubjectsLocationId: undefined,
        selectedSubjects: []
    });

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
        locationMetadata,
        locationExperimentMetadata,
    } = fetched.data;

    return (
        <>
            <ExperimentScheduleModal { ...({
                show: createExperimentModal.show,
                onHide: createExperimentModal.handleHide,
                modalPayloadData: createExperimentModal.data,
                studyId: studyIds.split(',')[0],
                studyType,
            }) } />
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
