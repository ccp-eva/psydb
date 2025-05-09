import React  from 'react';
import classnames from 'classnames';

import { omit } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useFetch,
    usePermissions,
    useRevision,
    useModalReducer,
    useURLSearchParams
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Button,
    PageWrappers
} from '@mpieva/psydb-ui-layout';

import { StudyTopic } from '@mpieva/psydb-ui-lib';

import CreateModal from './create-modal';
import EditModal from './edit-modal';
import RemoveModal from './remove-modal';

const StudyTopics = () => {
    var translate = useUITranslation();
    var permissions = usePermissions();
    var revision = useRevision();

    var createModal = useModalReducer();
    var editModal = useModalReducer();
    var removeModal = useModalReducer();

    var [ query, updateQuery ] = useURLSearchParams();

    var onCreate = (parent = { _id: null }) => (
        createModal.handleShow({ parent })
    )
    var onEdit = (id) => (
        editModal.handleShow({ id })
    )
    var onRemove = (id) => (
        removeModal.handleShow({ id })
    )
    var onSelect = (record) => (
        updateQuery({ ...query, selectedTopicId: record._id })
    )

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/study-topic-tree', {
            name: query.name || undefined,
            activeIds: (
                query.selectedTopicId
                ? [ query.selectedTopicId ]
                : undefined
            )
        })
    ), [ revision.value, query.name, query.selectedTopicId ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { trees, recordsCount } = fetched.data;

    return (
        <PageWrappers.Level1 title={ translate('Study Topics') }>
            <PageWrappers.Level2 title={ translate('Overview') }>
                <CreateModal
                    { ...createModal.passthrough }
                    onSuccessfulUpdate={ revision.up }
                />

                <EditModal
                    { ...editModal.passthrough }
                    onSuccessfulUpdate={ revision.up }
                />
                
                <RemoveModal
                    { ...removeModal.passthrough }
                    onSuccessfulUpdate={ revision.up }
                />

                <Button onClick={ () => onCreate() }>
                    { translate('New Study Topic') }
                </Button>

                <StudyTopic.QuickSearch
                    className='bg-light border-bottom pb-2 pt-1 mt-2 border-top px-3'
                    searchValues={ query }
                    onSubmit={ (next) => updateQuery(
                        omit({ from: next, paths: ['selectedTopicId' ] })
                    )}
                />
                <StudyTopic.Pagination
                    extraClassName='border-bottom'
                    total={ recordsCount }
                />

                <div className='px-3 py-1'>
                    <StudyTopic.TreeList {...({
                        trees,
                        onCreate,
                        onEdit,
                        onRemove,
                        onSelect,
                        selectedTopicId: query.selectedTopicId
                    })}/>
                </div>

                <StudyTopic.Pagination
                    extraClassName='border-top border-bottom'
                    total={ recordsCount }
                />
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    );
}


export default StudyTopics;
