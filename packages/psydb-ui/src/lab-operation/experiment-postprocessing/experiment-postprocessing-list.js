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

import {
    useFetch,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import DetailsIconButton from '@mpieva/psydb-ui-lib/src/details-icon-button';
import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';

import InhouseList from './inhouse-list';

const ExperimentPostprocessingListLoader = ({
}) => {
    var { path, url } = useRouteMatch();

    var {
        studyType,
        experimentType,
        subjectType,
        researchGroupId,
    } = useParams();

    var [ revision, incrementRevision ] = useRevision();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExperimentPostprocessing({
            experimentType,
            subjectRecordType: subjectType,
            researchGroupId,
        })
    }, [ researchGroupId, subjectType, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        records,
        relatedCustomRecordTypeLabels,
        relatedHelperSetItems,
        relatedRecordLabels,
    } = fetched.data;

    if (experimentType === 'inhouse') {
        return (
            <InhouseList {...({
                subjectType,

                records,
                relatedCustomRecordTypeLabels,
                relatedHelperSetItems,
                relatedRecordLabels,

                onSuccessfulUpdate: incrementRevision
            }) } />
        );
    }
    else if (experimentType === 'away-team') {
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
