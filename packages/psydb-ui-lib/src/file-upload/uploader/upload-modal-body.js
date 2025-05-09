import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useWriteRequest } from '@mpieva/psydb-ui-hooks';

import LoadingIndicator from './loading-indicator';


const UploadModalBody = (ps) => {
    var {
        onHide,
        accept,
        maxSize,

        onSuccessfulFileUpload,
        onFailedFileUpload,
    } = ps;

    var [ isHighlighted, setIsHighlighted ] = useState(false);
    var [ isValidUpload, setIsValidUpload ] = useState(undefined);
    var [ rejectedFiles, setRejectedFiles ] = useState([]);

    var write = useWriteRequest((agent, droppedFiles) => {
        return agent.uploadFiles({ files: droppedFiles })
    }, {
        onSuccessfulUpdate: demuxed([
            (response) => onSuccessfulFileUpload(response.data.data),
            onHide,
        ]),
        onFailedUpdate: onFailedFileUpload,
    });

    var bag = {
        isHighlighted: isHighlighted,
        isValidUpload,
        rejectedFiles,

        accept,
        maxSize,

        onDrop: (acceptedFiles = [], rejectedFiles = []) => {
            if (rejectedFiles.length > 0) {
                setIsValidUpload(false);
                setRejectedFiles(rejectedFiles);
            }
            else if (acceptedFiles.length > 0) {
                setIsValidUpload(true);
                write.exec(acceptedFiles);
            }
        },
        onDragEnter: () => setIsHighlighted(true),
        onDragLeave: () => setIsHighlighted(false),
    };

    return (
        write.isTransmitting
        ? <Loading />
        : <TheDropzone { ...bag } />
    );
}

const TheDropzone = (ps) => {
    var {
        isValidUpload,
        isHighlighted,
        rejectedFiles,

        accept,
        maxSize,
        
        ...downstream
    } = ps;

    var sharedBag = {
        accept,
        isHighlighted,
        maxSize,
    };

    return (
        <Dropzone
            style={{ position: 'relative' }}
            accept={ accept }
            maxSize={ maxSize }
            { ...downstream }
        >
            <CenteredContent>
                { isValidUpload === false ? (
                    <Rejected
                        { ...sharedBag }
                        rejectedFiles={ rejectedFiles}
                    />
                ) : (
                    <Default { ...sharedBag } />
                )}
            </CenteredContent>
        </Dropzone>
    );
}

const Default = ({ isHighlighted }) => {
    var translate = useUITranslation();
    return (
        <div style={{ color: '#c0c0c0' }}>
            <i 
                className='fas fa-upload fa-5x'
                style={{
                    ...(isHighlighted && { color: '#00bbf0' })
                }}
            />
            <div style={{ marginTop: '10px' }}>
                { translate('Drag files here to upload them or click to select files for upload.') }
            </div>
        </div>
    )
};

const Loading = () => (
    <CenteredContent>
        <LoadingIndicator />
    </CenteredContent>
);

const mbytes = (n) => (
    (n / 1024 / 1024).toFixed(2)
)

const Rejected = (ps) => {
    var { accept = '', maxSize, rejectedFiles } = ps;
    console.log(rejectedFiles);

    var acceptedExtensions = (
        accept.split(',').map(str => str.replace(/^[^\/]+\//, ''))
    );
    return (
        <div className='text-danger'>
            <i className='fas fa-times fa-5x' />
            <div style={{ marginTop: '10px' }}>
                Mögliche Formate sind:
                {' '}
                { acceptedExtensions.join(', ') }
                <br />
                Maximale Dateigrösse: { mbytes(maxSize) }MB
                <div className='border-top border-danger mt-2 pt-2'>
                    { rejectedFiles.map((it, ix ) => (
                        <div key={ ix } className='text-nowrap'>
                            { it.name }
                            {' '}
                            ("{ it.type }"; { mbytes(it.size) }MB)
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CenteredContent = ({ children }) => (
    <div style={{
        width: '250px',
        margin: 'auto',
        textAlign: 'center',
        padding: '100px 0px',
    }}>
        { children }
    </div>
);

export default UploadModalBody;
