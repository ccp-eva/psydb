import React, { useState } from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Button,
    Alert,
    WithDefaultModal,
} from '@mpieva/psydb-ui-layout';

import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectRecordViewModalBody = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,
        onSuccessfulUpdate
    } = ps;

    var {
        subjectType,
        subjectId,
    } = modalPayloadData;

    var permissions = usePermissions();
    var canEdit = permissions.hasFlag('canWriteSubjects');
    var [ hasEdited, setHasEdited ] = useState(false);

    var handleHide = demuxed([
        onHide,
        onSuccessfulUpdate
    ]);

    // TODO: create and RecordView composition that decides if
    // edit is available or we can only show details
    // use exact subject record permissions after fetch
    // instead of just checking flag

    return (
        <>
            { 
                hasEdited
                ? <HasEditedInfo onReEdit={ () => setHasEdited(false)}/>
                : (
                    <RecordEditor
                        collection='subject'
                        recordType={ subjectType }
                        id={ subjectId }
                        renderFormBox={ false }
                        onSuccessfulUpdate={ () => setHasEdited(true) }
                    />
                )
            }

            { hasEdited && (
                <>
                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Button onClick={ handleHide }>Schliessen</Button>
                    </div>
                    <hr />
                </>
            )}
        </>
    )
}

const HasEditedInfo = (ps) => {
    var { onReEdit } = ps;
    return (
        <Alert variant='info' className='d-flex justify-content-between'>
            <i>Proband:innendaten gespeichert!</i>
            <a role='button' className='force-hover' onClick={ onReEdit }>
                <b>Erneut bearbeiten</b>
            </a>
        </Alert>
    );
}

export const SubjectRecordViewModal = WithDefaultModal({
    Body: SubjectRecordViewModalBody,

    size: 'xl',
    title: 'Proband:in',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-light'
});
