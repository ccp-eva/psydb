import React, { useState } from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { WithDefaultModal, StateBasedSideNav, JsonRaw }
    from '@mpieva/psydb-ui-layout';

import EditFieldForm from './edit-field-form';

const EditFieldModalBody = (ps) => {
    var { record, onSuccessfulUpdate, onHide, modalPayloadData = {}} = ps;
    var { field } = modalPayloadData;

    var [{ translate }] = useI18N();
    var navhook = useState('/edit');
    var [ target ] = navhook;

    var nav = (
        <StateBasedSideNav hook={ navhook } links={[
            { href: '/edit', label: translate('Edit') },
            { href: '/raw-view', label: translate('Raw Data') },
        ]}/>
    )

    var content = undefined;
    switch (target) {
        case '/raw-view':
            content = (
                <JsonRaw.PRE
                    data={ field }
                    className='bg-white p-3 border'
                />
            )
            break;
        case '/edit':
        default:
            content = (
                <EditFieldForm
                    record={ record }
                    field={ field }
                    onSuccess={ demuxed([ onSuccessfulUpdate, onHide ]) }
                />
            )
            break;
    }

    return (
        <div className='d-flex'>
            <div className='flex-shrink-0'>
                { nav }
            </div>
            <div className='ml-2 flex-grow'>
                { content }
            </div>
        </div>
    );
}

const EditFieldModal = WithDefaultModal({
    title: 'Edit Field',
    size: 'xl',
    Body: EditFieldModalBody
});

export default EditFieldModal;
