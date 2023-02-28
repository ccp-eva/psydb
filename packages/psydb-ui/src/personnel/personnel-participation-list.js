import React from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    NotFound,
    UnexpectedResponseError
} from '@mpieva/psydb-ui-layout';

import {
    Table,
    SortableTH,
    StudyIconButton,
    ExperimentIconButton,
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

    return (
        <Table className='bg-white border'>
            <thead>
                <tr>
                    <th>Studie</th>
                    <th>Zeitpunkt</th>
                </tr>
            </thead>
            <tbody>
                { records.map((it, ix) => (
                    <tr>
                        <td>{ it.studyId }</td>
                        <td>{ it.timestamp }</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
} 
