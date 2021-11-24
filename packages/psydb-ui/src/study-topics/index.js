import React, { useContext } from 'react';

import {
    useFetch,
    usePermissions,
    useRevision,
    useModalReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Icons,
    Button
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
        <>
            <CreateModal
                { ...createModal.passthrough }
                onSuccessfulUpdate={ revision.up }
            />

            { trees.map((it, index) => (
                <Topic key={ index } { ...it } />
            ))}
            <Button onClick={ () => onCreate() }>
                Neues Thema
            </Button>
        </>
    );
}

const Topic = (ps) => {
    var { data, children, level = 0 } = ps;
    var { _id, state } = data;
    var { name, parentId } = state;

    return (
        <div>
            <div>{ name }</div>
            { children.map((it, index) => (
                <Topic
                    key={ index } level={ level + 1}
                    { ...it }
                />
            ))}
        </div>
    )
}

export default StudyTopics;
