import React from 'react';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import UploadModalBody from './upload-modal-body';

const UploadModal = WithDefaultModal({
    title: 'Upload Files',
    bodyClassName: 'bs5 p-0',
    size: 'md',
    Body: UploadModalBody
});

export default UploadModal;
