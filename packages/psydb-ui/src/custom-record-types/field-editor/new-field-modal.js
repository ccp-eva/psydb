import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import NewFieldForm from './new-field-form';

const NewFieldModalBody = (ps) => {
    var { record, onSuccessfulUpdate, onHide } = ps;
    return (
        <NewFieldForm
            record={ record }
            onSuccess={ demuxed([ onSuccessfulUpdate, onHide ]) }
        />
    );
}

const NewFieldModal = WithDefaultModal({
    title: 'New Field',
    size: 'xl',
    Body: NewFieldModalBody
});

export default NewFieldModal;
