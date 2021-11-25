import React, { useState }  from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import * as StudyTopic from '../study-topic';

export const StudyTopicPickerView = (ps) => {
    var { onSelect } = ps;
    var [ query, updateQuery ] = useState({ name: undefined });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/study-topic-tree', {
            name: query.name || undefined,
        })
    ), [ query.name ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { trees, recordsCount } = fetched.data;

    return (
        <div>
            <StudyTopic.QuickSearch
                searchValues={ query }
                onSubmit={ (next) => updateQuery(next) }
            />
            <StudyTopic.Pagination
                extraClassName='border-bottom'
                total={ recordsCount }
            />
            <div className='px-3 py-1 bg-white border border-top-0'>
                <StudyTopic.TreeList {...({
                    trees,
                    onSelect: (record) => onSelect({
                        ...record,
                        _recordLabel: record.state.name, // FIXME
                    }),
                })}/>
            </div>
        </div>
    )
}
