import React from 'react';
import { useParams } from 'react-router-dom';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import {
    usePermissions,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';
import { SubjectContactHistoryList }
    from '@mpieva/psydb-ui-record-views/subjects';

import Header from '../details/header';
import CreateModal from './create-modal';

const SubjectContactHistory = (ps) => {
    var { id } = useParams();
    var [{ translate }] = useI18N();
    var revision = useRevision();
    var permissions = usePermissions();
    var createModal = useModalReducer();

    var canCreate = permissions.hasCollectionFlag('subject', 'write');

    return (
        <div className='border pl-3 bg-light'>
            <CreateModal
                { ...createModal.passthrough }
                subjectId={ id }
                onSuccessfulUpdate={ revision.up }
            />
            <Header
                title={ translate('Contact History') }
                editLabel={ translate('Log Contact') }
                canEdit={ canCreate }
                onEditClick={ () => createModal.handleShow() }
            />
            <hr />
            <div className='pr-3 pb-3'>
                <SubjectContactHistoryList
                    subjectId={ id }
                    revision={ revision }
                />
            </div>
        </div>
    )
}

export default SubjectContactHistory;
