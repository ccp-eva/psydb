import React from 'react';

import {
    useRouteMatch,
    useParams
} from 'react-router-dom';

import jsonpointer from 'jsonpointer';

import {
    useFetchAll,
    useSortReducer,
    useSortURLSearchParams,
} from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    NotFound,
    UnexpectedResponseError
} from '@mpieva/psydb-ui-layout';

import ParticipationList from './participation-list';

const Participation = (ps) => {
    var {
        id: manualId,
        subjectType,
        revision = {},
        enableItemFunctions = true,
        //inModal = true,
    } = ps;
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var initialSort = {
        sortPath: 'timestamp',
        sortDirection: 'asc',
    }
    //var sorter = (
    //    inModal
    //    ? useSortReducer(initialSort)
    //    : useSortURLSearchParams(initialSort)
    //);
    var sorter = useSortReducer(initialSort);

    if (manualId) {
        id = manualId;
    }

    var [ didFetch, fetched ] = useFetchAll((agent) => {
        return {
            fetchRecordTypeMetadata: agent.readCustomRecordTypeMetadata(),
            fetchParticipationData: agent.fetchParticipatedStudiesForSubject({
                subjectId: id,
                sort: {
                    path: sorter.sortPath,
                    direction: sorter.sortDirection
                },
                extraAxiosConfig: { disableErrorModal: [ 404 ] },
            })
        }
    }, [ id, revision.value, sorter.sortPath, sorter.sortDirection ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    var { didReject, errorResponse } = fetched;
    if (didReject) {
        var { status } = errorResponse;
        if (status === 404) {
            return <NotFound />
        }
        else {
            return (
                <UnexpectedResponseError
                    errorResponse={ errorResponse }
                />
            )
        }
    }

    var {
        fetchRecordTypeMetadata: { data: recordTypeMetadata },
        fetchParticipationData: { data: participationData }
    } = fetched;

    return (
        <div>
            <ParticipationByType {...({
                sorter,
                subjectId: id,
                subjectType,
                participationData,
                onSuccessfulUpdate: revision.up,
                enableItemFunctions,
            }) }/>
        </div>
    );
}

const ParticipationByType = ({
    sorter,
    subjectId,
    subjectType,
    participationData,
    onSuccessfulUpdate,
    enableItemFunctions,
}) => {

    var {
        subjectData,
        participationByStudyType
    } = participationData;

    var ageFrameField = subjectData.displayFieldData.find(it => (
        it.props && it.props.isSpecialAgeFrameField
    ));

    var ageFrameFieldValue = undefined;
    if (ageFrameField) {
        ageFrameFieldValue = jsonpointer.get(
            subjectData.record,
            ageFrameField.dataPointer
        );
    }

    var studyTypes = Object.keys(participationByStudyType);
    if (studyTypes.length < 1) {
        return (
            <i className='text-muted'>Keine Studienteilnahmen vorhanden</i>
        )
    }

    return (
        <>
            { studyTypes.map(type => (
                <ParticipationList { ...({
                    key: type,
                    sorter,
                    subjectId,
                    subjectType,
                    studyType: type,
                    ageFrameField,
                    ageFrameFieldValue,
                    ...participationByStudyType[type],
                    onSuccessfulUpdate,
                    enableItemFunctions,
                })} />
            )) }
        </>
    )
}


export default Participation;
