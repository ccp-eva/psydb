import React from 'react';
import * as datefns from 'date-fns';
import { hasNone } from '@mpieva/psydb-core-utils';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    NotFound,
    UnexpectedResponseError,

    SubjectIconButton,
    StudyIconButton,
    ExperimentIconButton,
    
    Table,
    SortableTH,
    Alert,
} from '@mpieva/psydb-ui-layout';

export const PersonnelParticipationList = (ps) => {
    var { id } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchPersonnelParticipation({ personnelId: id })
    ), [ id ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fetched.data;
    if (hasNone(records)) {
        return (
            <Alert variant='info'><i>
                { translate('No past appointments found.') }
            </i></Alert>
        );
    }

    return (
        <>
            <div className='bg-white border p-3 mb-3'>
                <header><b>
                    { translate('In theese Studies') }:
                </b></header>
                { Object.values(related.study).sort((a,b) => (
                    a.localeCompare(b)
                )).join(', ') }
            </div>
            <Table className='bg-white border'>
                <thead>
                    <tr>
                        <th>{ translate('Date/Time') }</th>
                        <th>{ translate('Study') }</th>
                        <th>{ translate('Subject') }</th>
                    </tr>
                </thead>
                <tbody>
                    { records.map((it, ix) => {
                        var type = it.realType || it.type;

                        var { date, time } = formatDateTime(
                            it.timestamp, { locale }
                        );
                        
                        return (
                            <tr key={ ix }>
                                <td>
                                    { date }
                                    {' '}
                                    { it.type !== 'away-team' && time }
                                </td>
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
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

var formatDateTime  = (datelike, options = {}) => {
    var {
        dateFormat = 'P',
        timeFormat = 'p',
        locale,
    } = options;

    var date = undefined;
    if (!!datelike || datelike === 0) {
        date = new Date(datelike);
    }

    var formattedDate = datefns.format(date, dateFormat, { locale });
    var formattedTime = datefns.format(date, timeFormat, { locale });

    return {
        date: formattedDate,
        time: formattedTime
    }
}
