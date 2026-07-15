import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import SubjectContactHistoryImportCreateForm from './form';

const SubjectContactHistoryImportCreateModalBody = (ps) => {
    var { onHide, onSuccessfulUpdate } = ps;

    return (
        <>
            <SubjectContactHistoryImportCreateForm
                onSuccessfulUpdate={ demuxed([
                    onHide,
                    onSuccessfulUpdate
                ])}
            />
        </>
    );
}

const SubjectContactHistoryImportCreateModal = WithDefaultModal({
    Body: SubjectContactHistoryImportCreateModalBody,
    title: 'New Import',
    size: 'xl',
});

export default SubjectContactHistoryImportCreateModal;
