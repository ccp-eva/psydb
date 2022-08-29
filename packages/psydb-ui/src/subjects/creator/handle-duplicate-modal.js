import React  from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';

import {
    Button,
    WithDefaultModal,
} from '@mpieva/psydb-ui-layout';

const HandleDuplicateModalBody = (ps) => {
    var { onHide, modalPayloadData, onSuccessfulUpdate, recordType } = ps;
    var { responseData, formikForm } = modalPayloadData;
    var { possibleDuplicates, more } = responseData;

    var handleSubmit = () => {
        formikForm.setFieldValue('$.forceDuplicate', true);
        return formikForm.submitForm().then(demuxed([
            onSuccessfulUpdate, onHide
        ]))
    };

    return (
        <div>
            <div className='mt-2'>
                <header className='pb-1'>
                    Mögliche Duplikate
                </header>
                <div>
                    { possibleDuplicates.map(it => (
                        <div>
                            <a
                                target='_blank'
                                href={`#/subjects/${recordType}/${it._id}`}>
                                { it._recordLabel }
                            </a>
                        </div>
                    ))}
                </div>
                { more && (
                    '... und weitere'
                )}
            </div>
            <div className='d-flex justify-content-end mt-3 border-top pt-3'>
                <Button
                    size='sm'
                    onClick={ handleSubmit }
                    variant='danger'
                >
                    Trotzdem Anlegen
                </Button>
            </div>
        </div>
    )
}

const HandleDuplicateModal = WithDefaultModal({
    title: 'Mögliche Duplikate',
    size: 'md',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: HandleDuplicateModalBody,
});

export default HandleDuplicateModal;
