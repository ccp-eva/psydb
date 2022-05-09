import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
    Modal,
    Button
} from 'react-bootstrap';

import MailEditor from './mail-editor';
import MailTextPreview from './mail-text-preview';

const MailInviteModal = ({
    show,
    onHide,
    modalPayloadData,

    studyRecordType,
    subjectRecordType,

    totalSubjectCount,

    previewSubject,
    selectedSubjects,
    studyId,
    displayFieldData,
    
    onMailsSend,
}) => {
    var [ editorState, setEditorState ] = useState({})

    if (selectedSubjects.length > 0) {
        previewSubject = selectedSubjects[0];
        totalSubjectCount = selectedSubjects.length;
    }

    var allSubjectPlaceholders = useMemo(() => ([
        ...displayFieldData.map(it => ({
            key: it.key,
            dataPointer: it.dataPointer
        })),
        {
            key: 'onlineId',
            dataPointer: '/scientific/state/internals/onlineId',
        }
    ]), []);

    return (
        <Modal
            show={ show }
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Mails Senden</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
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
                                allSubjectPlaceholders={ allSubjectPlaceholders }
                                previewSubject={ previewSubject }
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
            </Modal.Body>
        </Modal>
    );
}

export default MailInviteModal;
