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
    useRevision,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    DetailsIconButton,
    ExperimentIconButton,
    Alert,
} from '@mpieva/psydb-ui-layout';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

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

    var revision = useRevision();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExperimentPostprocessing({
            experimentType,
            subjectRecordType: subjectType,
            researchGroupId,
        })
    }, [ researchGroupId, subjectType, revision.value ]);

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

                onSuccessfulUpdate: revision.up
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

                onSuccessfulUpdate: revision.up
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
    if (records.length < 1) {
        return <Fallback />
    }

    return (
        <Table>
            <TableHead />
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
                            <ExperimentIconButton to={`/experiments/${type}/${_id}`} />
                        </td>
                    </tr>
                }) }
            </tbody>
        </Table>
    )
}

const TableHead = (ps) => {
    return (
        <thead>
            <tr>
                <th>Typ</th>
                <th>Studie</th>
                <th>Ort</th>
                <th>Datum</th>
                <th></th>
            </tr>
        </thead>
    )
}

const Fallback = (ps) => {
    return (
        <>
            <Table className='mb-1'>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>Keine offenen Nachbereitungen gefunden</i>
            </Alert>
        </>
    )
}

const getExperimentTypeLabel = (type) => (
    {
        'away-team': 'Extern',
        'inhouse': 'Intern',
    }[type] || 'UNKNOWN'
)

export default ExperimentPostprocessingListLoader;
