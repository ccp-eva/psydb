import React from 'react';
import * as datefns from 'date-fns';
import { hasNone } from '@mpieva/psydb-core-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    NotFound,
    UnexpectedResponseError,

    SubjectIconButton,
    StudyIconButton,
    ExperimentIconButton,
} from '@mpieva/psydb-ui-layout';

import {
    Table,
    SortableTH,
    Alert,
} from '@mpieva/psydb-ui-layout';

export const PersonnelParticipationList = (ps) => {
    var { id } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchPersonnelParticipation({ personnelId: id })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fetched.data;
    if (hasNone(records)) {
        return (
            <Alert variant='info'>
                <i>Keine durchgeführten Termine gefunden</i>
            </Alert>
        );
    }

    return (
        <>
            <div className='bg-white border p-3 mb-3'>
                <header><b>In diesen Studien:</b></header>
                { Object.values(related.study).sort((a,b) => (
                    a.localeCompare(b)
                )).join(', ') }
            </div>
            <Table className='bg-white border'>
                <thead>
                    <tr>
                        <th>Zeitpunkt</th>
                        <th>Studie</th>
                        <th>Proband:in</th>
                    </tr>
                </thead>
                <tbody>
                    { records.map((it, ix) => (
                        <tr>
                            <td>{ datefns.format(new Date(it.timestamp), 'dd.MM.yyyy HH:mm') }</td>
                            <td>{ related.study[it.studyId] }</td>
                            <td>{ related.subject[it.subjectId] }</td>

                            <td className='d-flex justify-content-end'>
                                { it.type !== 'manual' && it.experimentId && (
                                    <ExperimentIconButton
                                        to={`/experiments/${it.type}/${it.experimentId}`}
                                    />
                                )}
                                <StudyIconButton
                                    to={`/studies/${it.studyType}/${it.studyId}`}
                                />
                                <SubjectIconButton
                                    to={`/subjects/${it.subjectType}/${it.subjectId}`}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
