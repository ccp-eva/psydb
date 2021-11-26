import React, { useState } from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { StudyTopic } from '@mpieva/psydb-ui-lib';

export const StudyTopicSelector = (ps) => {
    var { onSelect, selectedTopicId } = ps;
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
            <div className='px-3 py-1 bg-white border border-top-0'>
                <StudyTopic.TreeList {...({
                    trees,
                    onSelect,
                    selectedTopicId,
                })}/>
            </div>
        </div>
    )
}
