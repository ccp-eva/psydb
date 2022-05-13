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
        status: rawStatus,
        data: responseBody,
        config
    } = errorResponse;
    
    var {
        statusCode = rawStatus,
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
        case 404:
            return [ 'Nicht gefunden', NotFoundError ];
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

const NotFoundError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    return (
        <div className='text-danger'>
            Die angegebene URL konnte nicht gefunden werden.
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
