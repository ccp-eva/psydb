import React from 'react';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { formatDateInterval } from '@mpieva/psydb-ui-lib';

import {
    LoadingIndicator,
    Table,
    ExperimentIconButton,
} from '@mpieva/psydb-ui-layout';


const RelatedExperiments = (ps) => {
    var { csvImportId, revision } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCSVExperimentImportExperiments({
            csvImportId
        })
    ), [ csvImportId, revision ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, related } = fixRelated(fetched.data)
    if (records.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
        )
    }

    return (
        <Table className='bg-white border'>
            <thead>
                <tr>
                    <th>{ translate('Date/Time') }</th>
                    <th>{ translate('Subject') }</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { records.map((it, ix) => (
                    <Item
                        key={ ix }
                        record={ it }
                        related={ related }
                    />
                ))}
            </tbody>
        </Table>
    );
}

const Item = (ps) => {
    var { record, related } = ps;
    var { interval, subjectData } = record.state;

    var locale = useUILocale();
    var { startDate, startTime } = formatDateInterval(interval, { locale });
   
    var type = record.realType || record.type;
    var uri = `/experiments/${type}/${record._id}`;

    return (
        <>
            { subjectData.map((it, ix) => {
                var { subjectId } = it;
                return (
                    <tr key={ ix }>
                        <td>{ startDate } { startTime }</td>
                        <td>{ related.records.subject[subjectId]._recordLabel }</td>
                        <td className='d-flex justify-content-end'>
                            <ExperimentIconButton to={ uri } />
                        </td>
                    </tr>
                )
            }) }
        </>
    )
}

export default RelatedExperiments; 
