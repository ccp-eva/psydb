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

    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className='text-danger'>Fehler</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ErrorResponseContainer errorResponse={ errorResponse } />
            </Modal.Body>
        </Modal>
    );
}

const ErrorResponseContainer = ({
    errorResponse
}) => {
    console.log(errorResponse);

    var {
        data: responseBody,
        config
    } = errorResponse;
    
    var {
        statusCode,
    } = responseBody;

    var ErrorComponent = getErrorComponent(statusCode);

    return (
        <div>
            <div className='text-danger'>
                Es ist ein Fehler aufgetreten!
            </div>
            <hr />
            <ErrorComponent { ...responseBody }/>
        </div>
    );
}

const getErrorComponent = (statusCode) => {
    switch (statusCode) {
        case 400:
            return BadRequestError;
        default:
            return DefaultServerError;
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
        <div>
            <h5>{ apiStatus }</h5>
            <div>
                { data.message }
            </div>
        </div>
    )
}

export default ErrorResponseModal;
