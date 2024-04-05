import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import ExperimentImportCreateForm from './form';

const ExperimentImportCreateModalBody = (ps) => {
    var {
        subjectId,
        onHide,
        onSuccessfulUpdate
    } = ps;

    return (
        <>
            <ExperimentImportCreateForm
                onSuccessfulUpdate={ demuxed([
                    onHide,
                    onSuccessfulUpdate
                ])}
            />
        </>
    );
}

const ExperimentImportCreateModal = WithDefaultModal({
    Body: ExperimentImportCreateModalBody,
    title: 'New Import',
    size: 'xl',
});

export default ExperimentImportCreateModal;
