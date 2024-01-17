import React, { useState, useEffect, useReducer, useMemo } from 'react';

import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    Modal,
    Button,
    AsyncButton,
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

        selectedSubjects,

        studyId,
        displayFieldData,
        
        onMailsSend,
    } = ps;

    var [ editorState, setEditorState ] = useState({})

    var previewSubject = selectedSubjects[0];
    var totalSubjectCount = selectedSubjects.length;
   
    var send = useSend(() => ({
        type: 'experiment/create-for-online-survey',
        payload: {
            studyId,
            subjectIds: selectedSubjects.map(it => it._id),
            mailSubject: editorState.mailSubject,
            mailBody: editorState.mailText,
        }
    }), { onSuccessfulUpdate: undefined })

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readSubjectForInviteMail({ id: previewSubject._id })
    ), [ previewSubject._id ])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
   
    var previewInfo = fetched.data;
    console.log({ previewInfo });

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
                <AsyncButton
                    onClick={ send.exec }
                    isTransmitting={ send.isTransmitting }
                >
                    <b className='d-inline-block mr-2'>
                        { totalSubjectCount }
                    </b>
                    Proband:innen per Mail benachrichtigen
                </AsyncButton>
            </div>
        </div>
    );
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
