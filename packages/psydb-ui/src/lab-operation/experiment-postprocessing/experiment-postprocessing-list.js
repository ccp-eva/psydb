import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import { Table } from 'react-bootstrap';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';
import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';
import useRevision from '@mpieva/psydb-ui-lib/src/use-revision';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import DetailsIconButton from '@mpieva/psydb-ui-lib/src/details-icon-button';

const ExperimentPostprocessingListLoader = ({
}) => {
    var { path, url } = useRouteMatch();

    var {
        studyType,
        subjectType,
        researchGroupId,
    } = useParams();

    var [ revision, incrementRevision ] = useRevision();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExperimentPostprocessing({
            subjectRecordType: subjectType,
            researchGroupId,
        })
    }, [ researchGroupId, subjectType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        records,
        relatedCustomRecordTypeLabels,
        relatedHelperSetItems,
        relatedRecordLabels,
    } = fetched.data;

    return (
        <ExperimentPostprocessingList {...({
            records,
            relatedCustomRecordTypeLabels,
            relatedHelperSetItems,
            relatedRecordLabels,

            onSuccessfulUpdate: incrementRevision
        }) } />
    );
}

const ExperimentPostprocessingList = ({
    records,
    relatedCustomRecordTypeLabels,
    relatedHelperSetItems,
    relatedRecordLabels,
    onSuccessfulUpdate,
}) => {
    //var [ state, dispatch ] = useReducer(reducer, {});

    /*var [
        handleChangeStatus
    ] = useMemo(() => ([
        ({ experimentRecord, subjectRecord, status }) => {
            var message = {
                type: 'experiment/change-participation-status',
                payload: {
                    experimentId: experimentRecord._id,
                    subjectId: subjectRecord._id,
                    invitationStatus: status
                }
            }

            agent.send({ message })
            .then(response => {
                onSuccessfulUpdate && onSuccessfulUpdate(response);
            })
        }
    ]), [])*/

    return (
        <Table>
            <thead>
                <tr>
                    <th>Typ</th>
                    <th>Studie</th>
                    <th>Ort</th>
                    <th>Datum</th>
                    <th>Uhrzeit</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { records.map(it => {
                    var { _id, type, state } = it;

                    var stringifyExperimentValue = createStringifier({
                        record: it,
                        relatedCustomRecordTypeLabels,
                        relatedHelperSetItems,
                        relatedRecordLabels,
                    });

                    var {
                        startDate,
                        startTime,
                        endTime
                    } = formatInterval(state.interval);

                    return <tr key={ it._id }>
                        <td>{ getExperimentTypeLabel(type) }</td>
                        <td>
                            { stringifyExperimentValue({
                                ptr: '/state/studyId',
                                type: 'ForeignId',
                                collection: 'study'
                            })}
                        </td>
                        <td>
                            { stringifyExperimentValue({
                                ptr: '/state/locationId',
                                type: 'ForeignId',
                                collection: 'location'
                            })}
                        </td>
                        <td>{ startDate }</td>
                        <td>{
                            type === 'inhouse'
                            ? `${startTime} - ${endTime}`
                            : ''
                        }</td>
                        <td className='d-flex justify-content-end'>
                            <DetailsIconButton to={`/experiments/${type}/${_id}`} />
                        </td>
                    </tr>
                }) }
            </tbody>
        </Table>
    )
}

const getExperimentTypeLabel = (type) => (
    {
        'away-team': 'Extern',
        'inhouse': 'Intern',
    }[type] || 'UNKNOWN'
)

export default ExperimentPostprocessingListLoader;
