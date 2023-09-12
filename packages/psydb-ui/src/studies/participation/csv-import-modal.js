import React, { useState } from 'react';
import * as datefns from 'date-fns';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    LoadingIndicator,
    Table,
    Alert,
    Button,
} from '@mpieva/psydb-ui-layout';

import { UploadModalBody } from '@mpieva/psydb-ui-lib';

const CSVImportModalBody = (ps) => {
    var { onHide, studyId, onSuccessfulUpdate } = ps;
    var [ file, setFile ] = useState();

    var onSuccessfulFileUpload = (responseData) => {
        setFile(responseData.records[0]);
    }

    var send = useSend(() => ({
        type: 'csv-import/create-online-participation-import',
        payload: { studyId, fileId: file._id }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    return (
        file
        ? <CSVPreview file={ file } studyId={ studyId } send={ send } />
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
    var { file, studyId, send } = ps;
    var fileId = file._id;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCSVImportPreview({ fileId, studyId })
    ), [ fileId, studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { previewData, related } = fetched.data;
    var erroneousItems = previewData.filter(it => !!it.error);
    var hasErrors = erroneousItems.length > 0;

    return (
        <>
            { hasErrors ? (
                <Alert variant='danger'><b>
                    { translate(
                        '${count} errors found!',
                        { count: erroneousItems.length }
                    )}
                </b></Alert>
            ) : (
                <Alert variant='success'>
                    { translate('No errors found!') }
                </Alert>
            )}
            <Table className='bg-white'>
                <thead>
                    <tr>
                        <th>{ translate('Subject') }</th>
                        <th>{ translate('Online ID Code') }</th>
                        <th>{ translate('Date/Time') }</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { previewData.map(it => (
                        <Row previewItem={ it } related={ related } />
                    ))}
                </tbody>
            </Table>

            <Button
                onClick={ send.exec }
                disabled={ hasErrors || send.isTransmitting }
            >
                { send.isTransmitting ? (
                    translate('Please wait...')
                ) : (
                    translate('_perform_import')
                )}
            </Button>
        </>
    )
}

const Row = (ps) => {
    var { previewItem, related } = ps;
    var { subjectId, timestamp, onlineId, error } = previewItem;
    var locale = useUILocale();
    return (
        <tr className={ error ? 'text-danger' : '' }>
            <td>{ subjectId ? related.subject[subjectId] : '' }</td>
            <td>{ onlineId }</td>
            <td>{ datefns.format(new Date(timestamp), 'P p', { locale })}</td>
            <td>{ error }</td> 
        </tr>
    )
}

const CSVImportModal = WithDefaultModal({
    title: 'CSV Import',
    size: 'lg',
    Body: CSVImportModalBody
})

export default CSVImportModal;
