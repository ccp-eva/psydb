import React, { useState } from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator, Icons } from '@mpieva/psydb-ui-layout';

import { UploadModal } from '../../../file-upload';

// NOTE: removing only clears the form value; the file record stays in db
export const FileId = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikMeta,
        formikForm,

        accept,
        maxSize = 10 * 1024 * 1024,
        disabled,
        extraOnChange,
    } = ps;

    var translate = useUITranslation();
    var modal = useModalReducer();

    var { value: fileId } = formikField;
    var { error } = formikMeta;
    var { setFieldValue } = formikForm;

    // NOTE: caching the uploaded record so we dont need to refetch it
    var [ cachedFile, setCachedFile ] = useState();

    var file = (
        (cachedFile && cachedFile._id === fileId)
        ? cachedFile
        : undefined
    );

    var [ didFetch, fetched ] = useFetch((agent) => (
        (fileId && !file)
        ? agent.fetchOneRecord({ collection: 'file', fileId })
        : undefined
    ), {
        dependencies: [ fileId ],
        extraEffect: (response) => {
            var record = response?.data?.data?.record;
            if (record) {
                setCachedFile(record);
            }
        }
    });

    var onSuccessfulFileUpload = (data) => {
        var [ record ] = data.records;
        setCachedFile(record);
        setFieldValue(dataXPath, record._id);
        extraOnChange && extraOnChange(record._id, { record });
    }

    return (
        <div className={ error ? 'is-invalid' : undefined }>
            <UploadModal
                { ...modal.passthrough }
                accept={ accept }
                maxSize={ maxSize }
                onSuccessfulFileUpload={ onSuccessfulFileUpload }
                onFailedFileUpload={ () => {} }
            />

            { !fileId ? (
                <Button
                    size='sm'
                    variant='outline-primary'
                    disabled={ disabled }
                    onClick={ () => modal.handleShow() }
                >
                    { translate('Upload File') }
                </Button>
            ) : (
                <div className='d-flex align-items-center pt-1'>
                    { file ? (
                        <span>{ file.originalFilename }</span>
                    ) : (
                        didFetch
                        ? <i className='text-danger'>{ fileId }</i>
                        : <LoadingIndicator size='sm' />
                    )}
                    { !disabled && (
                        <a
                            role='button'
                            className='text-danger ml-2'
                            title={ translate('Remove') }
                            onClick={ () => {
                                setFieldValue(dataXPath, null);
                                extraOnChange && extraOnChange(null, {});
                            }}
                        >
                            <Icons.XLg style={{ marginTop: '-3px' }} />
                        </a>
                    )}
                </div>
            )}
        </div>
    )
}});
