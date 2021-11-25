import React, { useContext, useState } from 'react';
import classnames from 'classnames';

import {
    useFetch,
    usePermissions,
    useRevision,
    useModalReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Icons,
    Button,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import CreateModal from './create-modal';

var ActionContext = React.createContext();

const StudyTopics = () => {
    var permissions = usePermissions();
    var revision = useRevision();

    var createModal = useModalReducer();
    var editModal = useModalReducer();

    var onCreate = (parent = { _id: null }) => (
        createModal.handleShow({ parent })
    );
    var onEdit = (id) => (
        createModal.handleShow({ id })
    );

    var [ selectedTopicId, onSelect ] = useState();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/study-topic-tree', {
            name: undefined,
        })
    ), [ revision.value ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { trees } = fetched.data;

    return (
        <PageWrappers.Level1 title='Themengebiete'>
            <PageWrappers.Level2 title='Übersicht'>
                <CreateModal
                    { ...createModal.passthrough }
                    onSuccessfulUpdate={ revision.up }
                />

                <Button onClick={ () => onCreate() }>
                    Neues Hauptthema
                </Button>

                <ActionContext.Provider value={{
                    onCreate,
                    onEdit,
                    onSelect,
                    selectedTopicId
                }}>
                    { trees.map((it, index) => (
                        <Topic key={ index } { ...it } />
                    ))}
                </ActionContext.Provider>

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
    var { _id, state } = node;
    var { name, parentId } = state;

    //var Name = [0,1].includes(level) ? `h${4+level}` : 'div'
    var Name = level === 0 ? 'h5' : 'div'
    var isSelected = (selectedTopicId === _id);

    var wrapperClassName = classnames([
        level === 0 ? 'mb-2' : 'ml-4'
    ]);
    var nameClassName = classnames([
        'd-inline-block mr-2 pb-1',
        level === 0 && 'mt-2'
        //isSelected && 'text-primary text-bold'
    ]);

    return (
        <div className={ wrapperClassName }>
            <Name className='m-0'>
                <span
                    className={ nameClassName }
                    onClick={ () => onSelect(_id) }
                >
                    { name }
                </span>
                { isSelected && (
                    <a
                        className='btn btn-link p-0 m-0 border-0'
                        style={{ verticalAlign: 'baseline' }}
                        onClick={ () => onCreate(node) }
                    >
                        <Icons.Plus
                            viewBox='4 4 10 10'
                        />
                    </a>
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

export default StudyTopics;
