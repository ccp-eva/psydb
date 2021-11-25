import React, { useContext, useState } from 'react';
import classnames from 'classnames';

import {
    useFetch,
    usePermissions,
    useRevision,
    useModalReducer,
    useURLSearchParams
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Icons,
    Button,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import CreateModal from './create-modal';
import EditModal from './edit-modal';
import QuickSearch from './quick-search';
import Pagination from './pagination';

var ActionContext = React.createContext();

const StudyTopics = () => {
    var permissions = usePermissions();
    var revision = useRevision();

    var createModal = useModalReducer();
    var editModal = useModalReducer();

    var [ query, updateQuery ] = useURLSearchParams();
    var queryValues = Object.values(query);

    var onCreate = (parent = { _id: null }) => (
        createModal.handleShow({ parent })
    );
    var onEdit = (id) => (
        editModal.handleShow({ id })
    );
    var onSelect = (id) => (
        updateQuery({ ...query, selectedTopicId: id })
    )

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/study-topic-tree', {
            name: query.name || undefined,
            activeId: query.selectedTopicId
        })
    ), [
        revision.value,
        ...queryValues,
        queryValues.length,
    ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { trees, recordsCount } = fetched.data;

    return (
        <PageWrappers.Level1 title='Themengebiete'>
            <PageWrappers.Level2 title='Übersicht'>
                <CreateModal
                    { ...createModal.passthrough }
                    onSuccessfulUpdate={ revision.up }
                />

                <EditModal
                    { ...editModal.passthrough }
                    onSuccessfulUpdate={ revision.up }
                />

                <Button onClick={ () => onCreate() }>
                    Neues Themengebiet
                </Button>

                <QuickSearch
                    searchValues={ query }
                    onSubmit={ (next) => updateQuery(next)}
                />
                <Pagination
                    extraClassName='border-bottom'
                    total={ recordsCount }
                />

                <ActionContext.Provider value={{
                    onCreate,
                    onEdit,
                    onSelect,
                    selectedTopicId: query.selectedTopicId
                }}>
                    <div className='px-3 py-1'>
                        { trees.map((it, index) => (
                            <Topic key={ index } { ...it } />
                        ))}
                    </div>
                </ActionContext.Provider>

                <Pagination
                    extraClassName='border-top border-bottom'
                    total={ recordsCount }
                />
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    );
}

const Topic = (ps) => {
    var {
        onCreate,
        onEdit,
        onSelect,
        selectedTopicId
    } = useContext(ActionContext);

    var { data: node, children, level = 0 } = ps;
    var { _id, _matchesQuery, state } = node;
    var { name, parentId } = state;

    var isSelected = (selectedTopicId === _id);
    
    //var Name = [0,1].includes(level) ? `h${4+level}` : 'div'
    var Name = level === 0 ? 'h5' : 'div'
    var InnerName = isSelected ? 'b' : 'span';

    var wrapperClassName = classnames([
        level === 0 ? 'mb-2' : 'ml-4'
    ]);
    var nameClassName = classnames([
        'd-inline-block pb-1',
        level === 0 && 'mt-2',
        _matchesQuery && 'text-primary',
    ]);


    return (
        <div className={ wrapperClassName }>
            <Name className='m-0'>
                <InnerName
                    className={ nameClassName }
                    role='button'
                    onClick={ () => onSelect(_id) }
                >
                    { name }
                </InnerName>
                { isSelected && (
                    <>
                        <CreateButton onClick={ () => onCreate(node) } />
                        <EditButton onClick={ () => onEdit(_id) } />
                    </>
                )}
            </Name>
            <div
                className='ml-1 pl-1'
                style={{ borderLeft: '3px solid #ccc' }}
            >
                { children.map((it, index) => (
                    <Topic
                        key={ index } level={ level + 1 }
                        { ...it }
                    />
                ))}
            </div>
        </div>
    )
}

const CreateButton = (ps) => {
    var { onClick } = ps;
    return (
        <a
            className='btn btn-link p-0 m-0 border-0 ml-3 text-primary'
            style={{ verticalAlign: 'baseline' }}
            onClick={ onClick }
        >
            <Icons.Plus
                viewBox='4 4 10 10'
            />
        </a>
    )
}

const EditButton = (ps) => {
    var { onClick } = ps;
    return (
        <a
            className='btn btn-link p-0 m-0 border-0 ml-1 text-primary'
            style={{ verticalAlign: 'baseline' }}
            onClick={ onClick }
        >
            <Icons.PencilFill
                viewBox='0 0 18 18'
            />
        </a>
    )
}

export default StudyTopics;
