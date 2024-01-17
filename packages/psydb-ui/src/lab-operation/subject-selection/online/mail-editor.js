import React, { useState, useEffect, useReducer } from 'react';

import {
    Form
} from 'react-bootstrap';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

var defaults = {
    mailSubject: 'Einladung zu Online-Studie',
    mailText: `
        <p>Sehr geehrte Familie {{gdpr.lastname}}</p>
        <br>
        <p>
            wir möchten Sie herzlich einladen, mit ihrem Kind {{gdpr.firstname}},
            an einer Online-Studie teilzunehmen.
        </p>
        <br>
        <p>
            Für die Telnahme benutzen sie bitte folgenden Link:<br />{{link}}
        </p>
        <br>
        <p>
            Mit freundlichen Grüßen,
        <p>
        <p>ihr MPI-Team</p>
    `,
    link: 'https://example.com/online-studies/?studyId={{studyId}}&subjectOnlineId={{onlineId}}',
}

const MailEditor = ({
   onChange, 
}) => {
    var [ state, setState ] = useState({ ...defaults })

    var wrappedOnChange = (nextEditorValue) => {
        setState(nextEditorValue)
        onChange && onChange(nextEditorValue);
    }

    // trigger this once to get the default value out
    // FIXME: i think this is a hack
    // FIXME: i dont even need that since react-quil triggers that
    /*useEffect(() => {
        onChange({ ...defaults })
    }, [])*/

    return (
        <div>
            <Form.Group>
                <Form.Label><b>Betreff</b></Form.Label>
                <Form.Control type='text'
                    value={ state.mailSubject }
                    onChange={ (event) => {
                        var { target: { value }} = event;
                        wrappedOnChange({
                            ...state,
                            mailSubject: value
                        });
                    }}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label><b>Text</b></Form.Label>
                <div className='bg-white'>
                    <ReactQuill
                        value={ state.mailText }
                        onChange={ (value) => {
                            wrappedOnChange({
                                ...state,
                                mailText: value
                            });
                        }}
                    />
                </div>
            </Form.Group>

            <Form.Group>
                <Form.Label><b>Link</b></Form.Label>
                <Form.Control type='text'
                    value={ state.link }
                    onChange={ (event) => {
                        var { target: { value }} = event;
                        wrappedOnChange({
                            ...state,
                            link: value
                        });
                    }}
                />
            </Form.Group>

        </div>
    )
}

export default MailEditor;

