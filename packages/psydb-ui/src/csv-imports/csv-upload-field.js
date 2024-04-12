import React, { useState } from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Alert } from '@mpieva/psydb-ui-layout';
import { UploadModalBody } from '@mpieva/psydb-ui-lib';
import { withField, useFormikTheme } from '@mpieva/psydb-ui-lib';

const CSVUploadField = withField({
    onChangeReceivesEvents: false, isThemed: false,
    Control: (ps) => {
        var { label, saneFormikField } = ps;
        var {
            value: fileId,
            onChange,
        } = saneFormikField;

        var [ cachedFileRecord, setCachedFileRecord ] = useState();
        // FIXME: this is so ugly bro
        var [ didFetch, fetched ] = useFetch((agent) => (
            ( !cachedFileRecord && fileId )
            ? agent.fetchOneRecord({ collection: 'file', fileId })
            : undefined
        ), {
            dependencies: [ fileId ],
            extraEffect: (response) => {
                var fileRecord = response?.data?.data?.record;
                if (fileRecord) {
                    setCachedFileRecord(fileRecord)
                }
            }
        });

        var file = cachedFileRecord;

        return (
            <>
                <div className='d-flex justify-content-between mb-1'>
                    <b>{ label }</b>
                </div>
                { file && (
                    <Alert variant='info' className='mb-1'>
                        <b>Uploaded: { file.originalFilename }</b>
                    </Alert>
                )}
                <div className='border bg-white'>
                    <UploadModalBody
                        onHide={ () => {} }
                        accept='text/csv'
                        maxSize={ 10 * 1024 * 1024 }
                        onSuccessfulFileUpload={ (data) => {
                            var { records } = data;
                            setCachedFileRecord(records[0]);
                            onChange(records[0]._id);
                        }}
                        onFailedFileUpload={ () => {} }
                        mulitiple={ false }
                    />
                </div>
            </>
        )
    }
});

export default CSVUploadField;
