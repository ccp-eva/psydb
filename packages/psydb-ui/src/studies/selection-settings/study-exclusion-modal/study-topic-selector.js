import React, { useState } from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Icons } from '@mpieva/psydb-ui-layout';
import { StudyTopic } from '@mpieva/psydb-ui-lib';

export const StudyTopicSelector = (ps) => {
    var {
        studyTopicIds,
        selectedTopicIds,
        onSelect,
        onReset,
    } = ps;
    var [ quickSelect, setQuickSelect ] = useState('study-topics');
    var [ query, updateQuery ] = useState({ name: undefined });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/study-topic-tree', {
            name: query.name || undefined,
            activeIds: selectedTopicIds,
        })
    ), [ query.name, selectedTopicIds ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { trees, recordsCount } = fetched.data;

    return (
        <div>
            <StudyTopic.QuickSearch
                className='border-bottom pb-2'
                fillX={ true }
                searchValues={ query }
                onSubmit={ (next) => {
                    onReset()
                    setQuickSelect('none');
                    updateQuery(next)
                }}
            />
            <div className='pt-2 pb-2 border-bottom'>
                <QuickSelect { ...({
                    isActive: quickSelect === 'none',
                    onClick: () => {
                        setQuickSelect('none');
                        onReset();
                    }
                }) }>
                    Keine Themen-Einschränkung
                </QuickSelect>
                
                <QuickSelect { ...({
                    isActive: quickSelect === 'study-topics',
                    onClick: () => {
                        setQuickSelect('study-topics');
                        onReset(studyTopicIds);
                    }
                }) }>
                    Themen der Studie
                </QuickSelect>
            </div>
            <div className='px-3 py-1 bg-white border border-top-0'>
                <StudyTopic.TreeList {...({
                    trees,
                    onSelect: (record) => {
                        onSelect(record);
                        setQuickSelect(undefined);
                    },
                    selectedTopicIds,
                })}/>
            </div>
        </div>
    )
}

var QuickSelect = (ps) => {
    var { children, isActive, onClick } = ps;
    var Label = isActive ? 'b' : 'span';
    return (
        <div>
            <span role='button' onClick={ onClick }>
                { isActive
                    ? (
                        <small className='text-primary'>
                            <Icons.SquareFill />
                        </small>
                    )
                    : <small><Icons.Square /></small>
                }
                <Label
                    className='d-inline-block ml-2'
                    style={{ verticalAlign: 'middle' }}
                    role='button'
                >
                    { children }
                </Label>
            </span>
        </div>
    )
}
