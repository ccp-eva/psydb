import React from 'react';

import { Modal, Button } from 'react-bootstrap';

const ErrorResponseModal = ({
    show,
    onHide,
    modalPayloadData,
    errorResponse
}) => {
    errorResponse = (
        modalPayloadData
        ? modalPayloadData.errorResponse
        : errorResponse
    );

    if (!errorResponse) {
        return null;
    }

    var {
        data: responseBody,
        config
    } = errorResponse;
    
    var {
        statusCode,
    } = responseBody;

    var [ title, Body ] = getErrorComponents(statusCode);
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className='text-danger'>{ title }</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Body { ...responseBody } />
            </Modal.Body>
        </Modal>
    );
}

const getErrorComponents = (statusCode) => {
    switch (statusCode) {
        case 400:
            return [ 'Fehlerhafte Eingaben', BadRequestError ];
        default:
            return [ 'System-Fehler', DefaultServerError ];
    }
} 

const DefaultServerError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    return (
        <div>
            <h5>{ status } ({ statusCode })</h5>
            <div>
                { data.message }
            </div>
        </div>
    )
}

// TODO: make this properly display whats going on
const BadRequestError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    return (
        <div className='text-danger'>
            Die abgesendeten Daten enthalten fehlerhafte Eingaben.
        </div>
    )
}

export default ErrorResponseModal;
