import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import SubjectImportCreateForm from './form';

const SubjectImportCreateModalBody = (ps) => {
    var { onHide, onSuccessfulUpdate } = ps;

    return (
        <>
            <SubjectImportCreateForm
                onSuccessfulUpdate={ demuxed([
                    onHide,
                    onSuccessfulUpdate
                ])}
            />
        </>
    );
}

const SubjectImportCreateModal = WithDefaultModal({
    Body: SubjectImportCreateModalBody,
    title: 'New Import',
    size: 'xl',
});

export default SubjectImportCreateModal;
