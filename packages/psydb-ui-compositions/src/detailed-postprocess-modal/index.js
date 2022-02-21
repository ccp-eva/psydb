import React, { useState } from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    Button,
    Alert,
    WithDefaultModal,
} from '@mpieva/psydb-ui-layout';

import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';
import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';

import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const DetailedPostprocessModalBody = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,
        onSuccessfulUpdate
    } = ps;

    var {
        subjectType,
        subjectId,
        experimentRecord,
        relatedRecordLabels,
    } = modalPayloadData;

    var permissions = usePermissions();
    var canEdit = permissions.hasFlag('canWriteSubjects');
    var [ hasEdited, setHasEdited ] = useState(false);

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
                        onSuccessfulUpdate={ () => setHasEdited(true) }
                    />
                )
            }

            { hasEdited && (
                <>
                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Button onClick={ onHide }>Schliessen</Button>
                    </div>

            {/*<Postprocessing { ...({
                subjectId,
                experimentRecord,
                relatedRecordLabels,
                onSuccessfulUpdate: demuxed([
                    onHide, onSuccessfulUpdate
                ])
            }) } />*/}
            
                    <hr />
                </>
            )}
        </>
    );
}

const HasEditedInfo = (ps) => {
    var { onReEdit } = ps;
    return (
        <Alert variant='info' className='d-flex justify-content-between'>
            <i>Probandendaten gespeichert!</i>
            <a role='button' className='force-hover' onClick={ onReEdit }>
                <b>Erneut bearbeiten</b>
            </a>
        </Alert>
    );
}

const Postprocessing = (ps) => {
    var {
        subjectId,
        experimentRecord,
        relatedRecordLabels,
        onSuccessfulUpdate
    } = ps;
    
    var studyLabel = (
        relatedRecordLabels
        .study[experimentRecord.state.studyId]._recordLabel
    );

    var {
        startDate,
        startTime,
        endTime
    } = formatInterval(experimentRecord.state.interval);

    return (
        <div className='d-flex align-items-center'>
            <div className='mr-5'>
                <b>Datum:</b>
                {' '}
                { startDate }
                {' '}
                { startTime }
                {' - '}
                { endTime }
            </div>
            <div className='mr-5'>
                <b>Studie:</b>
                {' '}
                { studyLabel }
            </div>
            <div className='flex-grow'>
                <PostprocessSubjectForm { ...({
                    experimentId: experimentRecord._id,
                    subjectId,
                    onSuccessfulUpdate,
                }) } />
            </div>
        </div>
    )
}

export const DetailedPostprocessModal = WithDefaultModal({
    Body: DetailedPostprocessModalBody,

    size: 'xl',
    title: 'Nachbereitung',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-white'
});
