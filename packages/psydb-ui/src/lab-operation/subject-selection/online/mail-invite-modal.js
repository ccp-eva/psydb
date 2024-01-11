import React, { useState, useEffect, useReducer, useMemo } from 'react';

import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    Modal,
    Button,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import MailEditor from './mail-editor';
import MailTextPreview from './mail-text-preview';

const MailInviteModalBody = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,

        studyRecordType,
        subjectRecordType,

        totalSubjectCount,

        selectedSubjects,
        fallbackPreviewSubject,

        studyId,
        displayFieldData,
        
        onMailsSend,
    } = ps;

    var [ editorState, setEditorState ] = useState({})

    var previewSubject = fallbackPreviewSubject;
    if (selectedSubjects.length > 0) {
        previewSubject = selectedSubjects[0];
        totalSubjectCount = selectedSubjects.length;
    }
   
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readSubjectForInviteMail({ id: previewSubject._id })
    ), [ previewSubject._id ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
   
    var previewInfo = fetched.data;
    console.log({ previewInfo });

    var allSubjectPlaceholders = [
        ...displayFieldData.map(it => ({
            key: it.key,
            dataPointer: it.dataPointer
        })),
        {
            key: 'onlineId',
            dataPointer: '/onlineId',
        }
    ];

    return (
        <div>
            <MailEditor
                onChange={ (value) => {
                    setEditorState({
                        ...value,
                        mailText: (
                            value.mailText
                            .replaceAll('<p>', '<div>')
                            .replaceAll('</p>', '</div>')
                            .replaceAll(
                                '{{link}}',
                                `<a href="${value.link}">${value.link}</a>`
                            )
                            .replaceAll('{{studyId}}', studyId)
                        )
                    })
                }}
            />
            { previewSubject && (
                <>
                    <hr className='mt-4 mb-3'/>
                    <MailTextPreview
                        previewInfo={ previewInfo }
                        mailText={ editorState.mailText }
                    />
                </>
            )}
            <div className='d-flex justify-content-end mt-3'>
                <Button>
                    <b className='d-inline-block mr-2'>
                        { totalSubjectCount }
                    </b>
                    Proband:innen per Mail benachrichtigen
                </Button>
            </div>
        </div>
    );
}

const Fallback = () => {
    return (
        <Alert variant='danger'>
            <b>No Subjects Selected</b>
            <p>Please select at least one subject</p>
        </Alert>
    )
}

const MailInviteModal = WithDefaultModal({
    Body: MailInviteModalBody,

    title: 'Mail Invite',
    size: 'xl',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});


export default MailInviteModal;
