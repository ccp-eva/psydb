import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';

import UploadModal from './upload-modal';

var Uploader = ({ label, ...other }) => {
    var modal = useModalReducer();
    return (
        <>
            <UploadModal { ...other } { ...modal.passthrough } />
            <a
                className='d-inline-block pt-1'
                onClick={ modal.handleShow }
            >
                <span>{ label }</span>
            </a>
        </>
    );
};

export default Uploader;
