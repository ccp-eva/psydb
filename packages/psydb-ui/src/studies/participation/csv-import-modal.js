import React, { useState } from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { UploadModalBody } from '@mpieva/psydb-ui-lib';

const CSVImportModalBody = (ps) => {
    var { onHide } = ps;
    var [ file, setFile ] = useState();

    var onSuccessfulFileUpload = (responseData) => {
        console.log(responseData);
        setFile(responseData.records[0]);
    }

    return (
        file
        ? <CSVPreview file={ file } />
        : (
            <div className='m-2 border bg-white'>
                <UploadModalBody
                    onHide={ () => {} }
                    accept='text/csv'
                    maxSize={ 10 * 1024 * 1024 }
                    onSuccessfulFileUpload={ onSuccessfulFileUpload }
                    onFailedFileUpload={ () => {} }
                    mulitiple={ false }
                />
            </div>
        )
    )
}

const CSVPreview = (ps) => {
    var { file } = ps;

    return (
        file._id
    )
}

const CSVImportModal = WithDefaultModal({
    title: 'CSV Import',
    size: 'lg',
    Body: CSVImportModalBody
})

export default CSVImportModal;
